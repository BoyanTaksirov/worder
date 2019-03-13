const FeatureScreen = require("./feature_screen");
const WORD_LIST_SCREEN_TYPE = require("../globalData/globals").WORD_LIST_SCREEN_TYPE;
const WordAndMeaningField = require("../components/word_and_meaning_field");
const SectionChooser = require("../components/section_chooser");
const WordListSettingsPanel = require("../components/word_list_settings_panel");
const InputAndLabelWithButtonUni = require("../components/input_and_label_with_button_uni");
const StandardButton = require("../components/standard_button");
const StateButton = require("../components/state_button");
const ButtonState = require("../states/button_state");
const removeWhitespacesFromStartAndEnd = require("../utils/utils").removeWhitespacesFromStartAndEnd;

const DIALOG_ADD_EDIT_WORD = require("../globalData/globals.js").DIALOG_ADD_EDIT_WORD;
const ContextMenu = require("../components/context_menu");

const SORT_ORDERS = require("../globalData/globals").SORT_ORDERS;

const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class WordListScreen extends FeatureScreen{
    constructor(pContainer, fSwitch, controler) {
        super(pContainer, fSwitch, WORD_LIST_SCREEN_TYPE);

        this.controler = controler;

        this.onSectionButtonClick = this.onSectionButtonClick.bind(this);
        this.onWordClick = this.onWordClick.bind(this);
        this.onDeleteWordClick = this.onDeleteWordClick.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onAddWordClicked = this.onAddWordClicked.bind(this);
        this.onAddWordOnPlaceClick = this.onAddWordOnPlaceClick.bind(this);
        this.setMouseCoords = this.setMouseCoords.bind(this);
        this.updateView = this.updateView.bind(this);
        this.onCancelWord = this.onCancelWord.bind(this);
        this.onFieldEnter = this.onFieldEnter.bind(this);
        this.onSettingsClicked = this.onSettingsClicked.bind(this);
        this.onWordListSettingsChanged = this.onWordListSettingsChanged.bind(this);
        this.onCopyWordClicked = this.onCopyWordClicked.bind(this);
        this.onPasteWordClicked = this.onPasteWordClicked.bind(this);
        this.onTableEnter = this.onTableEnter.bind(this);
        this.onTableOut = this.onTableOut.bind(this);
        this.onSearchByWord = this.onSearchByWord.bind(this);
        this.onSearchByMeaning = this.onSearchByMeaning.bind(this);
        this.onExitSearchClicked = this.onExitSearchClicked.bind(this);
        this.onSearchSynonymsClicked = this.onSearchSynonymsClicked.bind(this);
        this.onSettingsClosed = this.onSettingsClosed.bind(this);
        this.onShowHideMeanings = this.onShowHideMeanings.bind(this);
        this.onShowHideWords = this.onShowHideWords.bind(this);
        this.onUpdateWord = this.onUpdateWord.bind(this);
        this.onClearAllMarks = this.onClearAllMarks.bind(this);
        this.onClearMarksEnter = this.onClearMarksEnter.bind(this);
        this.onClearMarksLeave = this.onClearMarksLeave.bind(this);
        this.removeVisualMarks = this.removeVisualMarks.bind(this);

        this.settingsParams = null;

        this.searchMode = false;

        this.wordFields = []; 

        this.lastActiveRow;
        this.lastMouseX;
        this.lastMouseY;
        this.copiedWordObject = -1;

        this.create();
        this.open();
    }

    create(){
        var bkgColor = "rgb(0, 98, 142)";

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.WordInputBkgClassName;
        this.container.style.paddingBottom = "5rem";

        this.infoSection = document.createElement("div");
        this.infoSection.className = CLASS_NAMES.StandardContainer;
        this.infoSection.style.minWidth = "40rem";
        this.infoSection.style.textAlign = "left";
        this.infoSection.style.backgroundColor = "rgba(255,255,255, 0.35)";
        this.container.appendChild(this.infoSection);

           //----------------------------------------------------------------------------

         //-----------------------------------------------------------------------------
         this.settingsHolder = document.createElement("div");
         this.settingsHolder.className = CLASS_NAMES.StandardContainer;
         this.settingsHolder.style.margin = "1rem 0";
         this.settingsHolder.style.width = "100%";
         this.settingsHolder.style.minWidth = "40rem";
         this.settingsHolder.style.textAlign = "right";
         this.settingsHolder.style.backgroundColor = "rgba(255,255,255, 0.35)";
         this.container.appendChild(this.settingsHolder);

         var settingsButtonStates = [
            new ButtonState("open settings", CLASS_NAMES.CustomButtonClassName,  this.onSettingsClicked, null),
            new ButtonState("close settings", CLASS_NAMES.CustomButtonClassState2Name, this.onSettingsClicked, null),
        ];

         this.settingsButton = new StateButton(settingsButtonStates, "SETTINGS_ID");
         this.settingsButton.setStyleProperty("width", "10rem");
         this.settingsButton.setStyleProperty("height", "2rem");
         this.settingsButton.addToContainer(this.settingsHolder);
 
         this.wordListSettingsPanel = new WordListSettingsPanel(this.settingsHolder, this.controler, this.onWordListSettingsChanged, this.onSettingsClosed);
         //---------------------------------------------------------------------------
   
        this.searchAddContainer = document.createElement("div");
        this.searchAddContainer.className = CLASS_NAMES.StandardContainer;
        this.searchAddContainer.style.display = "flex";
        this.searchAddContainer.style.flexDirection = "row";
        this.searchAddContainer.style.alignItems = "flex-start";
        this.searchAddContainer.style.minWidth = "40rem";
        this.searchAddContainer.style.backgroundColor = "rgba(255,255,255, 0.35)";
        this.container.appendChild(this.searchAddContainer);

        this.searchContainer = document.createElement("div");
        this.searchContainer.className = CLASS_NAMES.StandardContainer;
        this.searchContainer.style.display = "inline-block";
        this.searchContainer.style.width = "50%";
        this.searchContainer.style.minWidth = "40rem";
        this.searchContainer.style.margin = "0.2rem";
        this.searchContainer.style.backgroundColor = bkgColor;
        this.searchAddContainer.appendChild(this.searchContainer);

        this.searchByWordField = new InputAndLabelWithButtonUni(CLASS_NAMES.InputContainerWithButtonClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.searchContainer, "search by word", "", this.onSearchByWord, "search by word");
            this.searchByWordField.setLabelFontColor("white");
            this.searchByWordField.setBorderColor("white");
            this.searchByWordField.setLabelWidthPercent(70);
        this.searchByWordField.addToContainer();

        this.searchByMeaningField = new InputAndLabelWithButtonUni(CLASS_NAMES.InputContainerWithButtonClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.searchContainer, "search by meaning", "", this.onSearchByMeaning, "search by meaning");
            this.searchByMeaningField.setLabelFontColor("white");
            this.searchByMeaningField.setBorderColor("white");
            this.searchByMeaningField.setLabelWidthPercent(70);
        this.searchByMeaningField.addToContainer();

        this.exitSearchButton = new StandardButton("exit search", this.onExitSearchClicked);
        this.exitSearchButton.setStyleProperty("width", "7rem");
        this.exitSearchButton.setStyleProperty("height", "3rem");
        this.exitSearchButton.setStyleProperty("marginTop", "2rem");
        this.exitSearchButton.setButtonColor("rgb(255, 85, 42)");
        this.exitSearchButton.addToContainer(this.searchContainer);
        this.exitSearchButton.setButtonInactive();

        this.addWordButton = new StandardButton("add word", this.onAddWordClicked, CLASS_NAMES.AddWordButtonClass);
        this.addWordButton.setStyleProperty("width", "10rem");
        this.addWordButton.setStyleProperty("minWidth", "10rem");
        this.addWordButton.addToContainer(this.searchAddContainer);

        this.newLine = document.createElement("br");
        this.container.appendChild(this.newLine);

        this.wordContainer = document.createElement("div");
        this.container.appendChild(this.wordContainer);

        this.wordContainer.addEventListener("mouseenter", this.onTableEnter);
        this.wordContainer.addEventListener("mouseout", this.onTableOut);

         this.headerContainer = document.createElement("div");
         this.headerContainer.className = CLASS_NAMES.WMHeaderClass;
        
         this.headerLeftSection = document.createElement("div");
         this.headerLeftSection.className = CLASS_NAMES.HeaderSectionsClass;
         this.headerLeftSection.style.width = "60%";

         this.clearAllMarksButton = new StandardButton("clear all marks", this.onClearAllMarks, CLASS_NAMES.ClearAllMarksButtonClass, 
         "CLEAR_MARKS_ID", null, null, this.onClearMarksEnter, this.onClearMarksLeave, "Clears marks from all marked words.");
         this.clearAllMarksButton.setStyleProperty("float", "left");
         this.clearAllMarksButton.setStyleProperty("margin-left", "12%");
         this.clearAllMarksButton.addToContainer(this.headerLeftSection);

         var wordsDiv = document.createElement("div");
         wordsDiv.style.display = "inline-block";
         wordsDiv.innerText = "words";
         this.headerLeftSection.appendChild(wordsDiv);

         this.headerContainer.appendChild(this.headerLeftSection);

         this.headerRightSection = document.createElement("div");       
         this.headerRightSection.className = CLASS_NAMES.HeaderSectionsClass;
         this.headerRightSection.style.width = "40%";

         var meaningsDiv = document.createElement("div");
         meaningsDiv.style.display = "inline-block";
         meaningsDiv.innerText = "meanings";
         this.headerRightSection.appendChild(meaningsDiv);

         this.headerContainer.appendChild(this.headerRightSection);
         this.wordContainer.appendChild(this.headerContainer);

         var showHideMeaningButtonStates = [
            new ButtonState("hide meanings", CLASS_NAMES.CustomButtonClassState2Name, this.onShowHideMeanings, null),
            new ButtonState("show meanings", CLASS_NAMES.CustomButtonClassName, this.onShowHideMeanings, null),
        ];

         this.showHideMeaningsButton = new StateButton(showHideMeaningButtonStates, "SHOW_HIDE_MEANINGS_ID");
         this.showHideMeaningsButton.setStyleProperty("marginLeft", "1rem");
         this.showHideMeaningsButton.setStyleProperty("width", "9rem");
         this.showHideMeaningsButton.addToContainer(this.headerRightSection);

         var showHideWordsButtonStates = [
            new ButtonState("hide words", CLASS_NAMES.CustomButtonClassState2Name, this.onShowHideWords, null),
            new ButtonState("show words", CLASS_NAMES.CustomButtonClassName, this.onShowHideWords, null),
        ];

         this.showHideWordsButton = new StateButton(showHideWordsButtonStates, "SHOW_HIDE_WORDS_ID");
         this.showHideWordsButton.setStyleProperty("marginLeft", "1rem");
         this.showHideWordsButton.addToContainer(this.headerLeftSection);

        this.sectionChooser = new SectionChooser(this.container, this.onSectionButtonClick);

        this.contextMenu = new ContextMenu(this.container, this.onWordClick, this.onDeleteWordClick, 
            this.onAddWordOnPlaceClick, this.onCopyWordClicked, this.onPasteWordClicked, this.onSearchSynonymsClicked, this.onExitSearchClicked);
    }

    initializeWordList(){
        this.removeWordList();
        this.lastActiveRow = null;

        this.showHideWordsButton.setState(0);
        this.showHideMeaningsButton.setState(0);

        if(this.searchMode){
            this.initializeWordListBySearch();
            return;
        }

        var wordsDBCopy = this.controler.getWordsCopy();
        if(this.settingsParams && this.settingsParams.sortOrder !== SORT_ORDERS.INITIAL_ORDER){
            this.sortWords(wordsDBCopy, this.settingsParams.sortOrder);
        }

        var filteredWords;
        var filteringPerformed = false;
        if(this.settingsParams && this.settingsParams.useCategoriesForFiltering){
            filteredWords = this.filterWords(wordsDBCopy);
            filteringPerformed = (wordsDBCopy.length !== filteredWords.length); 
            if(filteringPerformed){
                wordsDBCopy = filteredWords;
            }
        }   
        
        var markedWords;
        var filterMarkedPerformed = false;
        if(this.settingsParams && this.settingsParams.includeOnlyMarked){
            markedWords = this.filterMarkedWords(wordsDBCopy);
            filterMarkedPerformed = (wordsDBCopy.length !== markedWords.length); 
            if(filterMarkedPerformed){
                wordsDBCopy = markedWords;
            }
        }

        var wordsCountPerPage = parseInt(this.controler.getWordsCountPerPage());
        this.sectionChooser.open(wordsDBCopy.length, this.controler.getWordsCountPerPage());  
        var currentSection = this.sectionChooser.getCurrentSection();
       
        var startIndex = wordsCountPerPage*currentSection;

        for(var i = startIndex; i < startIndex + wordsCountPerPage; i++)
        {
           if(i >= wordsDBCopy.length)
           {
               break;
           }  
           
            let newWordRecord = new WordAndMeaningField(wordsDBCopy[i], i, CLASS_NAMES.WMContainerClassName,
                CLASS_NAMES.ListLabelClassName, this.wordContainer, this.onFieldEnter, this.settingsParams, this.onUpdateWord, this.controler);

            newWordRecord.addToContainer();           
            this.wordFields.push(newWordRecord);    
        }

        this.setInfoSectionData(this.controler.getWordsCount(), this.controler.getCategoryCount(), this.controler.getDBName());
    }

    initializeWordListBySearch(){

        this.showHideWordsButton.setState(0, false);
        this.showHideMeaningsButton.setState(0, false);

        var currentSection = this.sectionChooser.getCurrentSection();
        var wordsCountPerPage = parseInt(this.controler.getWordsCountPerPage());
        var startIndex = wordsCountPerPage*currentSection;

        for(var i = startIndex; i < startIndex + this.controler.getWordsCountPerPage(); i++)
        {
           if(i >= this.searchResults.length)
           {
               break;
           }  
           
            let newWordRecord = new WordAndMeaningField(this.searchResults[i], i, CLASS_NAMES.WMContainerClassName,
                CLASS_NAMES.ListLabelClassName, this.wordContainer, this.onFieldEnter, null, this.onUpdateWord);

            newWordRecord.addToContainer();
            
            this.wordFields.push(newWordRecord);    
        }

        this.sectionChooser.open(this.searchResults.length, this.controler.getWordsCountPerPage());  

        this.exitSearchButton.setButtonActive();
    }

    filterWords(wordObjectArray){
        var filteredWordArray = [];
        for(var i = 0; i < wordObjectArray.length; i++){
            var match = this.checkWordForCategoryMatch(wordObjectArray[i]);
            if(match){
                filteredWordArray.push(wordObjectArray[i]);
            }
        }
        return(filteredWordArray);
    }

    filterMarkedWords(wordObjectArray){
        var filteredMarkedWordArray = [];
        for(var i = 0; i < wordObjectArray.length; i++){
            if(wordObjectArray[i].marked){
                filteredMarkedWordArray.push(wordObjectArray[i]);
            }
        }
        return(filteredMarkedWordArray);
    }

    checkWordForCategoryMatch(wordObject){
        var result = false;
        wordObject.categories.forEach(
                                        wordCategory=>{
                                                        if(!this.settingsParams.categoriesSelected){
                                                            return(false);
                                                        }                                                       
                                                        this.settingsParams.categoriesSelected.forEach(
                                                            categoryCriterion=>{
                                                                if(categoryCriterion === wordCategory.category){
                                                                    result = true;
                                                                }                                                                                            
                                                            })
                                                })
        return result;
    }

    removeWordList(){
        for(var i = 0; i < this.wordFields.length; i++)
        {
               this.wordFields[i].clear();           
        }

        this.wordFields = [];
    }

    updateView(){    
        this.wordListSettingsPanel.updateView();
        this.initializeWordList();
    }

    onCancelWord(){
        this.controler.closeDialog(DIALOG_ADD_EDIT_WORD);
    }

    onSectionButtonClick(){
        this.initializeWordList();
    }

    onShowHideMeanings(state){
        if(state === 0){
            this.hideMeanings();
        }
        else{
            this.showMeanings();
        }
    }

    showMeanings(){
        for(var i = 0; i < this.wordFields.length; i++){
            this.wordFields[i].showMeaningFields();
        }
    }

    hideMeanings(){
        for(var i = 0; i < this.wordFields.length; i++){
            this.wordFields[i].hideMeaningFields();
        }
    }

    onShowHideWords(state){
        if(state === 0){
            this.hideWords();
        }
        else if(state === 1){
            this.showWords();
        }
    }

    showWords(){
        for(var i = 0; i < this.wordFields.length; i++){
            this.wordFields[i].showWordFields();
        }
    }

    hideWords(){
        for(var i = 0; i < this.wordFields.length; i++){
            this.wordFields[i].hideWordFields();
        }
    }


    onFieldEnter(ifEnter, yCoord, fieldIndex, currentWordObject){
        if(ifEnter){     
            if(this.lastActiveRow){
                this.lastActiveRow.clearBkgColor();
            }

            var yCoordReal = yCoord;
            this.contextMenu.update(yCoordReal, fieldIndex, currentWordObject);
            this.lastActiveRow = this.wordFields[fieldIndex];
        }     
    }

    onSettingsClicked(state){
        if(state === 0){
            this.wordListSettingsPanel.open();
        }
        else if(state === 1){
            this.wordListSettingsPanel.close();
        }      
    }

    onWordListSettingsChanged(params){
        this.settingsParams = params;
        this.controler.setWordCountPerPage(params.wordCountPerPage);
    }

    onSettingsClosed(){
        this.settingsButton.setLabel("open settings");
    }

    sortWords(words, sortOrder){
        if(sortOrder ===  SORT_ORDERS.DATE_ORDER){  
            words.sort(this.dateOrderSort);
        }
        else if(sortOrder === SORT_ORDERS.ALPHABET_ORDER){
            words.sort(this.alphabetOrderSort);
        }
        else if(sortOrder === SORT_ORDERS.INITIAL_ORDER){
            
        }
    }

    dateOrderSort(wordObj1, wordObj2){
        var date1 = parseInt(wordObj1.date);
        var date2 = parseInt(wordObj2.date);

        return(date1 - date2);
    }

    alphabetOrderSort(wordObj1, wordObj2){
        return wordObj1.word.localeCompare(wordObj2.word);     
    }

    setInfoSectionData(wordCount, categoriesCount, dbName){
        let infoText = "Database Name: " + dbName + "\n" +
                       "Words in Dictionary: " + wordCount + "\n" +
                       "Categories Count: " + categoriesCount;
                       
        this.infoSection.innerText = infoText;
    }

    onWordClick(wordObject){
       var params = {
           wordObject: wordObject,
       }
       this.controler.openDialog(DIALOG_ADD_EDIT_WORD, params);
    }

    onDeleteWordClick(wordObject){
        this.controler.openMessageBoxYesNo("Are you sure to delete word '" + wordObject.word + "' from dictionary?", 
        this.deleteWord, null)
        this.wordObjectForDelete = wordObject;
    }

    onClearAllMarks(){
        this.controler.askIfClearAllMarks(this.removeVisualMarks);
    }

    removeVisualMarks(){
        for(var i = 0; i < this.wordFields.length; i++){
            this.wordFields[i].updateVisualMarks();
        }
    }

    onClearMarksEnter(cmButton){
        var tooltipText = cmButton.tooltipMessage;
        var bRect = cmButton.button.getBoundingClientRect();
        var xCoord = bRect.left + bRect.width + 25;
        var yCoord = bRect.top - 10;
        var coords = {
            top: yCoord,
            left: xCoord
        }
        this.controler.openTooltip([tooltipText, coords]);
    }

    onClearMarksLeave(){
        this.controler.closeTooltip();
    }

    deleteWord(){
        var deletedWord = this.controler.deleteWordById(this.wordObjectForDelete.wordId);

        if(this.searchMode){
            for(let i = 0; i < this.searchResults.length; i++){
                if(deletedWord.wordId === this.searchResults[i].wordId){
                    this.searchResults.splice(i,1);
                    break;
                }
            }
        }

        this.initializeWordList();
       
        this.wordObjectForDelete = null;
    }

    onAddWordClicked(){       
        this.controler.onAddWord();
    }

    onAddWordOnPlaceClick(wordObject){
        var params = {
            wordObject: wordObject,
        }
        this.controler.onAddWord(params, true);
    }

    onCopyWordClicked(wordObject){
        this.copiedWordObject = wordObject;
    }

    onPasteWordClicked(wordObject){
        if(!this.copiedWordObject){
            return;
        }
        this.controler.changeWordOrder(this.copiedWordObject, wordObject);
        this.copiedWordObject = null;
    }

    onSearchByWord(params){
        var searchedText = removeWhitespacesFromStartAndEnd(params.value);
        if(searchedText === ""){
            this.controler.openMessageBox("No search word entered!", null);
            return;
        }
        this.searchResults = this.controler.searchWordByName(searchedText);
        this.searchMode = true;

        this.contextMenu.setSearchButtonState(1);

        this.initializeWordList();
    }

    onSearchByMeaning(params){
        var searchedText = removeWhitespacesFromStartAndEnd(params.value);
        if(searchedText === ""){
            this.controler.openMessageBox("No search meaning word entered!", null);
            return;
        }
        this.searchResults = this.controler.searchWordByMeaning(searchedText);
        this.searchMode = true;

        this.contextMenu.setSearchButtonState(1);

        this.initializeWordList();
    }

    onSearchSynonymsClicked(wordObject){       
        var meanings = this.controler.getMeaningsByWordId(wordObject.wordId);

        this.searchMode = true;
        this.searchResults = [];
        for(let i = 0; i < meanings.length; i++){
            var tempResults = this.controler.getWordByMeaning(meanings[i]);         
            var originalIndex = tempResults.indexOf(this.controler.getWordById(wordObject.wordId));
            tempResults.splice(originalIndex, 1);
            this.searchResults = this.searchResults.concat(tempResults);                  
        }

        this.searchResults.unshift(this.controler.getWordById(wordObject.wordId));
        this.sectionChooser.open(this.searchResults.length, this.controler.getWordsCountPerPage(), true); 
        
        this.initializeWordList();
    }

    onExitSearchClicked(param){
        this.searchMode = false;

        if(param !== "CONTEXT_MENU"){
            this.contextMenu.setSearchButtonState(0);
        }
    
        this.initializeWordList();
        this.exitSearchButton.setButtonInactive();
    }

    onUpdateWord(wordObject, updateViews = true){
        this.controler.onUpdateWord(wordObject, updateViews);
    }

    setMouseCoords(e){
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    onTableEnter(e){
        let bRect = this.wordContainer.getBoundingClientRect();
        if(e.clientY > bRect.top && e.clientY < bRect.bottom && e.clientX > bRect.left && e.clientX < bRect.right)
        {
            this.contextMenu.open();
        }
         
        //this.enterExitHandler(false, this.topPos, this.wordDBIndex);
     }

    onTableOut(e){
        let bRect = this.wordContainer.getBoundingClientRect();
        if(e.clientY > bRect.top && e.clientY < bRect.bottom && e.clientX > bRect.left && e.clientX < bRect.right)
        {
            return;
        }
    
        this.contextMenu.close();

        //this.enterExitHandler(false, this.topPos, this.wordDBIndex);
     }

    //---------------------create new category dialog------------------

    addToContainer(){
        if(!this.container.parentNode)   
        {
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer(){
        if(this.container.parentNode)   
        {
            this.parentContainer.removeChild(this.container);   
        }
    }

    open(){
        window.removeEventListener("mousemove", this.setMouseCoords);
        window.addEventListener("mousemove", this.setMouseCoords);
        this.copiedWordObject =-1;
        this.updateView();
        this.sectionChooser.open(this.controler.getWordsCount(), this.controler.getWordsCountPerPage());
        this.addToContainer();
    }

    clear(){       
        window.removeEventListener("mousemove", this.setMouseCoords);
        this.removeWordList();
        this.settingsButton.clear();
        this.addWordButton.clear();
        this.exitSearchButton.clear();
        this.showHideMeaningsButton.clear();
        this.clearAllMarksButton.clear();
        this.searchByWordField.clear();
        this.searchByMeaningField.clear();
        this.contextMenu.clear();
        this.sectionChooser.clear();

        this.wordListSettingsPanel.clear();

        this.controler.closeAllDialogs();
        this.wordObjectForDelete = null;
        this.removeFromContainer();
    }    
}