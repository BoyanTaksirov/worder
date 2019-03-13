const remote = require('electron').remote;
const goToLink = remote.require('./main.js').goToLink;

const shortid = require('shortid');

const DB_Connection = require("../globalData/DB_Connection");

const DIALOG_ADD_EDIT_WORD = require("../globalData/globals.js").DIALOG_ADD_EDIT_WORD;
const DIALOG_ADD_CATEGORY = require("../globalData/globals.js").DIALOG_ADD_CATEGORY;
const DIALOG_CREATE_NEW_CATEGORY = require("../globalData/globals.js").DIALOG_CREATE_NEW_CATEGORY;
const DIALOG_MESSAGE_BOX = require("../globalData/globals.js").DIALOG_MESSAGE_BOX;
const DIALOG_MESSAGE_BOX_YES_NO = require("../globalData/globals.js").DIALOG_MESSAGE_BOX_YES_NO;
const DIALOG_TOOLTIP = require("../globalData/globals.js").DIALOG_TOOLTIP;
const CONTEXT_MENU = require("../globalData/globals.js").CONTEXT_MENU;

const WORD_ADD_MODE = require("../globalData/globals.js").WORD_ADD_MODE;
const WORD_UPDATE_MODE = require("../globalData/globals.js").WORD_UPDATE_MODE;
const CLASS_NAMES = require("../globalData/globals.js").CLASS_NAMES;

const currentVersion = require("../globalData/globals.js").currentVersion;

const MAIN_MENU_SCREEN_TYPE = require("../globalData/globals.js").MAIN_MENU_SCREEN_TYPE;
const EXAM_SCREEN_TYPE = require("../globalData/globals.js").EXAM_SCREEN_TYPE;
const WORD_LIST_SCREEN_TYPE = require("../globalData/globals.js").WORD_LIST_SCREEN_TYPE;
const CONFIGURE_DB_SCREEN_TYPE = require("../globalData/globals").CONFIGURE_DB_SCREEN_TYPE;

const MM_BUTTON_DATA = require("../globalData/globals").MM_BUTTON_DATA;

const ScreenDialogManager = require("../screens/screen_dialog_manager.js");
const HomeScreen = require("../screens/home_screen.js");
const TopMenuScreen = require("../screens/top_menu_screen.js");
const WordListScreen = require("../screens/word_list_screen.js");
const ExamScreen = require("../screens/exam_screen.js");
const ConfigureDBScreen = require("../screens/configure_db_screen");


module.exports = class Controler{
    constructor(){

        this.onDatabaseLoaded = this.onDatabaseLoaded.bind(this);

        this.updateAllViews = this.updateAllViews.bind(this);
        this.wordDatabase = new DB_Connection(this.onDatabaseLoaded, this.updateAllViews);

        this.onSaveWord = this.onSaveWord.bind(this);
        this.onSaveFailed = this.onSaveFailed.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onUpdateWord = this.onUpdateWord.bind(this);
        this.onAddWord = this.onAddWord.bind(this);
        this.onAddCategory = this.onAddCategory.bind(this);
        this.onCategoryAdded = this.onCategoryAdded.bind(this);
        this.onAddCategoryCancel = this.onAddCategoryCancel.bind(this);
        this.onNewCategoryCreated = this.onNewCategoryCreated.bind(this);
        this.onCreateNewCategoryCancel = this.onCreateNewCategoryCancel.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.applyDialogFunction = this.applyDialogFunction.bind(this);
        this.onCloseAddEditWord = this.onCloseAddEditWord.bind(this);
        this.closeAllDialogs = this.closeAllDialogs.bind(this);
        this.openMessageBox = this.openMessageBox.bind(this);
        this.openMessageBoxYesNo = this.openMessageBoxYesNo.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.activateTopMenuButtons = this.activateTopMenuButtons.bind(this);
        this.deactivateTopMenuButtons = this.deactivateTopMenuButtons.bind(this);
        this.willDeleteCategory = this.willDeleteCategory.bind(this);
        this.clearAllMarks = this.clearAllMarks.bind(this);

        this.switchScreenFunction = this.switchScreenFunction.bind(this);
        this.additionalMenuFunctionality = this.additionalMenuFunctionality.bind(this);

        this.screensObject = {
            homeScreenInstance: null,
            examScreenScreenInstance: null,
            wordListScreenInstance: null,
            configureDBScreenInstance: null
        }

        this.createElements();
        this.createScreen(MAIN_MENU_SCREEN_TYPE);
        this.topMenu.setActiveButton(MM_BUTTON_DATA.homeBtn.id);
    };

    //---------------------------SCREENS MANAGEMENT---------------------------------

    createElements(){
        this.globalContainer = document.createElement("div");
        this.globalContainer.className = CLASS_NAMES.GlobalContainerClassName;
        document.body.appendChild(this.globalContainer);
    
        this.topMenu = new TopMenuScreen(this.globalContainer, this.switchScreenFunction, this, this.additionalMenuFunctionality);

        this.credits = document.createElement("div");
        this.credits.className = CLASS_NAMES.CreditsClass;
        this.creditsLink = document.createElement("div");
        this.creditsLink.innerHTML = "Boyan Taksirov 2019, www.blite.eu, v. " + currentVersion;
        this.creditsLink.className = CLASS_NAMES.CreditsLinkClass;
        this.creditsLink.addEventListener("click", this.goToPortfolioLink);
        this.credits.appendChild(this.creditsLink);
        this.globalContainer.appendChild(this.credits);
    
        this.screenContainer = document.createElement("div");
        this.screenContainer.className = CLASS_NAMES.ScreenContainerClassName;
        this.globalContainer.appendChild(this.screenContainer);
    
        this.dialogManager = new ScreenDialogManager(this.screenContainer, this.wordDatabase, this);
    }

    goToPortfolioLink(){
        goToLink();
    }

    createScreen(type) {
        this.clearScreens();
    
        if (type === MAIN_MENU_SCREEN_TYPE) {
            this.screensObject.homeScreenInstance = new HomeScreen(this.screenContainer, this.switchScreenFunction, this);
        }
        else if (type === EXAM_SCREEN_TYPE) {
            this.screensObject.examScreenScreenInstance = new ExamScreen(this.screenContainer, this.switchScreenFunction, 
                this.activateTopMenuButtons, this.deactivateTopMenuButtons, this);
        }
        else if (type === WORD_LIST_SCREEN_TYPE) {
            this.screensObject.wordListScreenInstance = new WordListScreen(this.screenContainer, this.switchScreenFunction, this);
        }
        else if (type === CONFIGURE_DB_SCREEN_TYPE) {
            this.screensObject.configureDBScreenInstance = new ConfigureDBScreen(this.screenContainer, this.switchScreenFunction, this);
        }
    }

    clearScreens() {
        for (var currentScreen in this.screensObject) {
            if (this.screensObject.hasOwnProperty(currentScreen)) {
                if (this.screensObject[currentScreen]) {
                    this.screensObject[currentScreen].clear();
                    this.screensObject[currentScreen] = null;
                }
            }
        }
    }

    switchScreenFunction(id) {
        switch(id){
            case MM_BUTTON_DATA.homeBtn.id:
                this.createScreen(MAIN_MENU_SCREEN_TYPE);
                break;

            case MM_BUTTON_DATA.listWordsBtn.id:
                this.createScreen(WORD_LIST_SCREEN_TYPE);
                break;

            case MM_BUTTON_DATA.examScreenBtn.id:
                this.createScreen(EXAM_SCREEN_TYPE); 
                break;

            case MM_BUTTON_DATA.configureDBBtn.id:
                this.createScreen(CONFIGURE_DB_SCREEN_TYPE); 
                break;
        }
    }

    additionalMenuFunctionality(id){
        switch(id){
            case "ADD_WORD_ID":
                this.onAddWord();
                break;

                case "ADD_CATEGORY_ID":
                this.onCreateNewCategory();
                break;
        }
    }

     //---------------------------END SCREENS MANAGEMENT---------------------------------


     onSaveWord(newWordObject, forceSave = false){
        var saved = this.wordDatabase.pushNewWord(newWordObject, forceSave);   
        return(saved);
    }

    onSaveWordOnPlace(newWordObject, destinationWordObject){
        var saved = this.wordDatabase.placeWordAboveAnother(newWordObject, destinationWordObject);   
        return(saved);
    }

    onSaveFailed(...dArguments){
        this.dialogManager.openDialog(DIALOG_MESSAGE_BOX, [...dArguments, ()=>{this.closeDialog(DIALOG_MESSAGE_BOX)}]);
    }

    openMessageBox(message, handler){
        var newHandler;
            if(!handler){
                newHandler = ()=>{
                this.closeDialog(DIALOG_MESSAGE_BOX);
            }
        }
        else{
                newHandler = ()=>{
                handler();
                this.closeDialog(DIALOG_MESSAGE_BOX);
            }
        }

        this.dialogManager.openDialog(DIALOG_MESSAGE_BOX, [message, newHandler]);
    }

    openMessageBoxYesNo(message, yesHandler, noHandler, yesHandlerParams = null, noHandlerParams = null){
        var newYesHandler = (yesHandlerParams)=>{
              yesHandler(yesHandlerParams);
              this.closeDialog(DIALOG_MESSAGE_BOX_YES_NO);
        }

        var newNoHandler;
        if(noHandler)
        {
                newNoHandler = (noHandlerParams)=>{
                noHandler(noHandlerParams);
                this.closeDialog(DIALOG_MESSAGE_BOX_YES_NO);
            }
        }
        else
        {
            newNoHandler = ()=>{
            this.closeDialog(DIALOG_MESSAGE_BOX_YES_NO);
        }
      }

        this.dialogManager.openDialog(DIALOG_MESSAGE_BOX_YES_NO, [message, newYesHandler, newNoHandler, yesHandlerParams, noHandlerParams]);
    }

    onUpdateWord(updatedWordObject, updateViews = true){
        this.wordDatabase.updateWord(updatedWordObject, updateViews);
    }

    askIfClearAllMarks(clearVisualMarksCallback){
        this.openMessageBoxYesNo("Do you really want to delete all marks? ", this.clearAllMarks, null, clearVisualMarksCallback);      
    }

    clearAllMarks(clearVisualMarksCallback){
        this.wordDatabase.clearAllMarks();
        clearVisualMarksCallback();
    }

    deleteWord(wordIndex){
        this.wordDatabase.deleteWord(wordIndex);
    }

    deleteWordById(id){
        return this.wordDatabase.deleteWordById(id);
    }

    onAddWord(params = null, onPlace = false){
        if(this.dialogManager.checkIfDialogOpened(DIALOG_ADD_EDIT_WORD)){
            return;
        }
        var onSaveWordComposed;
        
        if(!onPlace){
            onSaveWordComposed = (newWordObject, forceSave = null)=>{
                var saved = this.onSaveWord(newWordObject, forceSave);
                return(saved)}
        }
        else{
            onSaveWordComposed = (newWordObject)=>{
                var saved = this.onSaveWordOnPlace(newWordObject, params.wordObject);
                return(saved)}
        }

        var onSaveWord = onSaveWordComposed;
        var onAddCategory = this.onAddCategory;
        var onCloseAddEditWord = this.onCloseAddEditWord;
        var onSaveFailed = this.onSaveFailed;

        var handlers = {
            onSaveWord: onSaveWord,
            onAddCategory: onAddCategory,
            wordObject: null,
            onUpdateWord: null,
            onCloseAddEditWord: onCloseAddEditWord,
            onSaveFailed: onSaveFailed,
            mode: WORD_ADD_MODE
        }
       
        this.dialogManager.openDialog(DIALOG_ADD_EDIT_WORD, handlers);
    }

    onEditWord(params){
        var onAddCategory = this.onAddCategory;
        var wordObject = params.wordObject;
        var onUpdateWord = this.onUpdateWord;
                       
        var onCloseAddEditWord = this.onCloseAddEditWord;
        var onSaveFailed = this.onSaveFailed;
       
        var handlers = {
            onSaveWord: null,
            onAddCategory: onAddCategory,
            wordObject: wordObject,
            onUpdateWord: onUpdateWord,
            onCloseAddEditWord: onCloseAddEditWord,
            onSaveFailed: onSaveFailed,
            mode: WORD_UPDATE_MODE
        }
        this.dialogManager.openDialog(DIALOG_ADD_EDIT_WORD, handlers);
    }

    changeWordOrder(currentWordObject, destinationWordObject){
        this.wordDatabase.deleteWordById(currentWordObject.wordId);
        this.wordDatabase.placeWordAboveAnother(currentWordObject, destinationWordObject);       
    }

    onAddCategory(){
        this.dialogManager.openDialog(DIALOG_ADD_CATEGORY, [this.onCategoryAdded, this.onAddCategoryCancel, this.onNewCategoryCreated, 
            this.wordDatabase.getCategories(), this.willDeleteCategory]);
    }

    onCreateNewCategory(){
        this.dialogManager.openDialog(DIALOG_CREATE_NEW_CATEGORY, [this.onNewCategoryCreated, this.wordDatabase.getCategories(), 
            this.willDeleteCategory,  this.onCreateNewCategoryCancel]);
    }

    willDeleteCategory(categoryName){
        this.openMessageBoxYesNo("Do you really want to delete category " + categoryName + " from database?", this.removeCategory, null, [categoryName]);
    }

    onCreateNewCategoryCancel(){
        this.closeDialog(DIALOG_CREATE_NEW_CATEGORY);
    }

    onAddCategoryCancel(){
        this.closeDialog(DIALOG_ADD_CATEGORY);
    }

    removeCategory(categoryName){
        var categoryDeleted = this.wordDatabase.removeCategory(categoryName);
        if(categoryDeleted){
            this.dialogManager.applyDialogFunction(DIALOG_ADD_CATEGORY, "updateCategoryItems", [this.wordDatabase.getCategories()]);
            return(true);
        }
        else{
            return(false);
        }
    }

    getCategories(){
        return this.wordDatabase.getCategories();
    }

    onCategoryAdded(addedCategoryName){
        this.dialogManager.closeDialog(DIALOG_ADD_CATEGORY);
        this.dialogManager.applyDialogFunction(DIALOG_ADD_EDIT_WORD, "onNewCategoryAdded", [addedCategoryName]);
    }

    onNewCategoryCreated(newCategoryName){
        if(this.wordDatabase.checkForExistingCategory(newCategoryName)){
            return;
        }
        var categorySaved = this.wordDatabase.pushNewCategory(newCategoryName);
        if(categorySaved){
            return(true);
        }
        else{
            return(false);
        }
    }

    activateTopMenuButtons(){
        this.topMenu.activateButtons();
    }

    deactivateTopMenuButtons(){
        this.topMenu.deactivateButtons();
    }

    updateAllViews(){
        if(this.screensObject.wordListScreenInstance){
            this.screensObject.wordListScreenInstance.updateView();
        }
        if(this.screensObject.examScreenScreenInstance){
            this.screensObject.examScreenScreenInstance.updateView();
        }

        this.dialogManager.applyDialogFunction(DIALOG_ADD_CATEGORY, "updateCategoryItems", [this.wordDatabase.getCategories()]);   
        this.dialogManager.applyDialogFunction(DIALOG_CREATE_NEW_CATEGORY, "updateCategoryItems", [this.wordDatabase.getCategories()]);       
    }

    openTooltip(params){
        this.openDialog(DIALOG_TOOLTIP, params);
    }

    closeTooltip(){
        this.closeDialog(DIALOG_TOOLTIP);
    }

    openDialog(dialogId, params = null){
        switch(dialogId){
            case DIALOG_ADD_CATEGORY:
                 this.onAddCategory();
                 break;
            
            case DIALOG_ADD_EDIT_WORD:
                if(!params || !params.wordObject){
                    this.onAddWord();
                }
                else if(params.wordObject){
                    this.onEditWord(params);
                }
            break;

            case DIALOG_MESSAGE_BOX:
                   this.openMessageBox(dialogId, params)
            break;

            case DIALOG_MESSAGE_BOX_YES_NO:
                this.openMessageBoxYesNo(dialogId, params)
            break;

            case CONTEXT_MENU:
                 this.dialogManager.openDialog(dialogId, params);
                break;

            case DIALOG_TOOLTIP:
                this.dialogManager.openDialog(dialogId, params);
               break;
        }
    }

    closeDialog(dialogId){
        this.dialogManager.closeDialog(dialogId);
    }

    applyDialogFunction(dialogId, functionName, params){
        this.dialogManager.applyDialogFunction(dialogId, functionName, params);
    }

    onCloseAddEditWord(){
        this.closeDialog(DIALOG_ADD_EDIT_WORD)
    }

    closeAllDialogs(){
        this.dialogManager.closeDialog(DIALOG_ADD_EDIT_WORD);  
        this.dialogManager.closeDialog(DIALOG_ADD_CATEGORY);
        this.dialogManager.closeDialog(DIALOG_MESSAGE_BOX);
        this.dialogManager.closeDialog(DIALOG_MESSAGE_BOX_YES_NO);
        this.dialogManager.closeDialog(CONTEXT_MENU);
        this.dialogManager.closeDialog(DIALOG_TOOLTIP);
    }

    loadDatabase(dbName){
        this.wordDatabase.loadDatabase(dbName);
    }

    onDatabaseLoaded(success){
        if(success){
           this.openMessageBox("Database " + this.wordDatabase.getDBName() + " loaded!", null);
        }
        else{
            this.openMessageBox("Database failed to load!", null);
        }        
    }

    setWordMarked(wordObject, state){
        this.wordDatabase.setWordMarked(wordObject, state);
    }

    getDBName(){
        return this.wordDatabase.getDBName();
    }

    getWordsCount(){
        return this.wordDatabase.getWordCount();
    }

    getCategoryCount(){
        return this.wordDatabase.getCategoryCount();
    }

    getWordById(id){
        return this.wordDatabase.getWordById(id);
    }

    getWordByIndex(index){
        return this.wordDatabase.getWordByIndex(index);
    }

    getExamQuestionsCount(){
        return this.wordDatabase.getExamQuestionsCount();
    }

    setExamQuestionsCount(value){
        this.wordDatabase.setExamQuestionsCount(value);
    }

    getWordsCountPerPage(){
        return this.wordDatabase.getWordCountPerPage();
    }

    getWordsCopy(){
        return this.wordDatabase.DB.words.slice();
    }

    setWordCountPerPage(count){
        this.wordDatabase.setWordCountPerPage(count);
    }

    getWordByName(name){
        return this.wordDatabase.getWordByName(name);
    }

    getWordById(id){
        return this.wordDatabase.getWordById(id);
    }

    searchWordByName(name){
        return this.wordDatabase.searchWordByName(name);
    }

    getMeaningsByWordIndex(index){
        return this.wordDatabase.DB.words[index].meanings;
    }

    getMeaningsByWordId(wordId){
        return this.wordDatabase.getMeaningsByWordId(wordId);
    }

    getWordByMeaning(meaning){
        return this.wordDatabase.getWordByMeaning(meaning);
    }

    searchWordByMeaning(meaning){
        return this.wordDatabase.searchWordByMeaning(meaning);
    }


}