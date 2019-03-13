const path = require('path');
const readFile = require('fs').readFile;

const remote = require('electron').remote;
const saveDB = remote.require('./main.js').saveDB;
const readTextFile = remote.require('./main.js').readTextFile;
const saveTextFile = remote.require('./main.js').saveTextFile;
const loadDB = remote.require('./main.js').loadDB;

const DB_NAME = require('./globals').DB_NAME;
const DB_DIR_NAME = require("../globalData/globals").DB_DIR_NAME;
const LAST_DB_USED_FILE_NAME = require("../globalData/globals").LAST_DB_USED_FILE_NAME;
const USER_DATA_DIR_NAME = require("../globalData/globals").USER_DATA_DIR_NAME;


module.exports = class DB_Connection{
    constructor(onDatabaseLoad, updateViewsCallback){
        this.DB;  
        this.onDBRead = this.onDBRead.bind(this);  
        this.onDBSaved = this.onDBSaved.bind(this);
        this.onLastDBRead = this.onLastDBRead.bind(this);
        this.loadDefaultDatabase = this.loadDefaultDatabase.bind(this);
        this.onLastDBNameSaved = this.onLastDBNameSaved.bind(this);
        this.updateViewsCallback = updateViewsCallback;

        this.onDatabaseLoad = onDatabaseLoad;  
            
        readTextFile(LAST_DB_USED_FILE_NAME, USER_DATA_DIR_NAME, this.onLastDBRead);
    }

    onLastDBRead(err, data){
        if(!err){
            this.loadDatabase(data);
        }
        else{
            this.loadDefaultDatabase();
        }
    }

    loadDefaultDatabase(){
        this.loadDatabase(DB_NAME);
    }

    loadDatabase(databaseName){
        this.currentDBName = databaseName;
        loadDB(this.currentDBName, 'utf8', this.onDBRead);
    }

    onDBRead(err, data){
        if(err){
            if(this.currentDBName === DB_NAME){
                this.createDefaultDB();
            }
            else{
                this.loadDefaultDatabase();
            }           
            return;
        }
        else{
               try{
                    this.DB = JSON.parse(data);
               }
               catch(err){
                   if(data !== ""){
                        this.createDefaultDB();
                        return;
                   }
                   else if(data === "")  // if(data.buffer.byteLength === 0)  this means empty file, rewriting is allowed
                   {
                       this.DB = {};
                   }
               }               
        }         
           
        var needSave = false;

        if(!this.DB.settings || !this.DB.settings.wordCountPerPage){
            this.DB.settings = {};
            this.DB.settings.wordCountPerPage = 100;

            needSave = true;
        }

        if(!this.DB.categories){
            this.DB.categories = [];

            needSave = true;
        }

        if(!this.repairCategoriesRecords()){
            needSave = true;
        }

        if(!this.DB.words){
            this.DB.words = [];

            needSave = true;
        }

        if(!this.DB.dbNameId){
            this.DB.dbNameId = this.currentDBName;

            needSave = true;
        }

        if(!this.DB.examQuestionsCount){
            this.DB.examQuestionsCount = 20;

            needSave = true;
        }

        if(this.fillUnlistedCategories()){
            needSave = true;
        }

        if(needSave){
            this.saveDBAndUpdateViews();
        }

        saveTextFile(LAST_DB_USED_FILE_NAME, USER_DATA_DIR_NAME, this.currentDBName, this.onLastDBNameSaved);

        this.onDatabaseLoad(true);
    }

    onLastDBNameSaved(err){
      
    }

    fillUnlistedCategories(){
        var willSave = false;
        this.DB.words.forEach(word => {
            word.categories.forEach(wordCategory => {
                if(this.DB.categories.indexOf(wordCategory.category) === -1){
                    this.DB.categories.push(wordCategory.category);
                    willSave = true;
                }
            })
        });

        return willSave;
    }

    getCategories(){
        return this.DB.categories;
    }

    pushNewWord(wordObject, forceSave){    
            if(!this.checkForExistingWord(wordObject)){
                if(!forceSave){
                    return(false);
                }              
                else{
                    this.updateWordByName(wordObject);
                    return(true);
                }
            }       
            
        this.DB.words.push(wordObject);
        this.saveDBAndUpdateViews();

        return(true);
    }

    repairCategoriesRecords(){       
        var recordsGood = true;

        for(let i = 0; i < this.DB.categories.length; i++){
            if(!this.DB.categories[i]){
                this.DB.categories.splice(i, 1);
                recordsGood = false;
            }
        }

        return(recordsGood);
    }

    getMeaningsByWordId(id){
        for(let i = 0; i < this.DB.words.length; i++){
            if(id === this.DB.words[i].wordId){
                return(this.DB.words[i].meanings);
            }
        }
    }

    placeWordAboveAnother(wordObjectToBeCopied, destinationWordObject){      
        for(let i = 0; i < this.DB.words.length; i++){
            if(destinationWordObject.wordId === this.DB.words[i].wordId){
                this.DB.words.splice(i, 0, wordObjectToBeCopied);
                break;
            }
        }
        this.saveDBAndUpdateViews();
        return(true);
    }

    placeWordOnIndex(wordObject, index, checkNeeded = false){
        if(checkNeeded){
            if(!this.checkForExistingWord(wordObject)){
                return(false);
            }
        }
        this.DB.words.splice(index, 0, wordObject);

        this.saveDBAndUpdateViews();

        return(true);
    }

    pushNewCategory(newCategory){
        if(this.checkForExistingCategory(newCategory)){
            return(false);
        }

        this.DB.categories.push(newCategory);
        this.saveDBAndUpdateViews();

        return(true);
    }

    removeCategory(categoryName){
        for(let i = 0; i < this.DB.categories.length; i++){
            if(categoryName === this.DB.categories[i]){
                this.DB.categories.splice(i, 1);
                this.saveDBAndUpdateViews();
                return(true);
            }
        }
        return(false);
    }

    checkForExistingCategory(newCategoryName){
        for(let i = 0; i < this.DB.categories.length; i++){
            if(newCategoryName === this.DB.categories[i]){
                return(true);
            }
        }

        return(false);
    }

    checkForExistingWord(wordObject){
        for(let i = 0; i < this.DB.words.length; i++){
            if(wordObject.word === this.DB.words[i].word){
                return(false);
            }
        }

        return(true);
    }

    getWordById(id){
        for(let i = 0; i < this.DB.words.length; i++){
            if(id === this.DB.words[i].wordId){
               return this.DB.words[i];
            }
        }
       this.saveDBAndUpdateViews();
    }

    getWordByIndex(wordIndex){
        return(this.DB.words[wordIndex]);
    }

    getWordByName(name){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            if(name === this.DB.words[i].word){
                results.push(this.DB.words[i]);
            }
        }
        return results;
    }

    /*searchWordByName(name){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            if(this.DB.words[i].word.indexOf(name) !== -1){
                results.push(this.DB.words[i]);
            }
        }
        return results;
    }

    searchWordByMeaning(meaning){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            for(let n = 0; n < this.DB.words[i].meanings.length; n++){
                if(this.DB.words[i].meanings[n].indexOf(meaning) !== -1){
                    results.push(this.DB.words[i]);
                }
            }          
        }
        return results;
    }*/

    searchWordByName(name){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            if(this.DB.words[i].word.toLowerCase().indexOf(name.toLowerCase()) !== -1){
                results.push(this.DB.words[i]);
            }
        }
        return results;
    }

    searchWordByMeaning(meaning){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            for(let n = 0; n < this.DB.words[i].meanings.length; n++){
                if(this.DB.words[i].meanings[n].toLowerCase().indexOf(meaning.toLowerCase()) !== -1){
                    results.push(this.DB.words[i]);
                }
            }          
        }
        return results;
    }



    getWordByMeaning(meaning){
        var results = [];
        for(let i = 0; i < this.DB.words.length; i++){
            for(let n = 0; n < this.DB.words[i].meanings.length; n++){
                if(meaning === this.DB.words[i].meanings[n]){
                    results.push(this.DB.words[i]);
                }
            }          
        }
        return results;
    }

  

    updateWord(wordObject, updateViews = true){
        for(let i = 0; i < this.DB.words.length; i++)
        {
            if(wordObject.wordId === this.DB.words[i].wordId)
            {
                for(let propertyName in wordObject){
                    this.DB.words[i][propertyName] = wordObject[propertyName];
                }              
            }
        }
        if(updateViews){
            this.saveDBAndUpdateViews();
        }
        else{
            this.saveDB_NoUpdate();
        }
    }

    updateWordByName(wordObject){
        var results = this.getWordByName(wordObject.word);
        results[0].meanings = wordObject.meanings;
        results[0].categories = wordObject.categories;
        this.saveDBAndUpdateViews();
    }

    removeCategoryFromWord(wordObject){
        for(let i = 0; i < this.DB.words.length; i++)
        {
            if(wordObject.wordId === this.DB.words[i].wordId)
            {             
                this.DB.words[i].categories = wordObject.categories;
            }
        }
        this.saveDBAndUpdateViews();
    }

    clearAllMarks(){
        var changed = false;
        for(let i = 0; i < this.DB.words.length; i++){
            if(this.DB.words[i].marked){
                this.DB.words[i].marked = false;
                changed = true;
            }
        }
        
        if(changed){
            this.saveDB_NoUpdate();
        }     
    }

    deleteWord(wordIndex){
        this.DB.words.splice(wordIndex, 1);
        this.saveDBAndUpdateViews();
    }

    deleteWordById(wordId){
        for(let i = 0; i < this.DB.words.length; i++)
        {
            if(this.DB.words[i].wordId === wordId){
                var wordCopy = Object.assign({}, this.DB.words[i])
                this.deleteWord(i);
                return wordCopy;
            }
        }
    }

    getWordCount(){
        return this.DB.words.length;
    }

    getCategoryCount(){
        return this.DB.categories.length;
    }

    getWordCountPerPage(){
        return(this.DB.settings.wordCountPerPage);
    }

    setWordCountPerPage(value){
        this.DB.settings.wordCountPerPage = parseInt(value);
        this.saveDBAndUpdateViews();
    }

    getExamQuestionsCount(){
        if(!this.DB.examQuestionsCount){
            this.DB.examQuestionsCount = 20;
            this.saveDBAndUpdateViews();
        }
        return this.DB.examQuestionsCount;
    }

    setExamQuestionsCount(value){
        this.DB.examQuestionsCount = value;
        this.saveDBAndUpdateViews();
    }

    onDBSaved(err){
        if(!err){       
            if(this.updateViewsCallback){
                this.updateViewsCallback();
            }
        }
    }

    getDBName(){
        return this.DB.dbNameId;
    }

    saveDBAndUpdateViews(){             
        saveDB(this.DB, this.currentDBName, this.onDBSaved);
    }

    saveDB_NoUpdate(){             
        saveDB(this.DB, this.currentDBName, function(){});
    }

    createDefaultDB(){
        saveDB("", DB_NAME, this.loadDefaultDatabase);
    }
}

 


