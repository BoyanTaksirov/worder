const shortid = require('shortid');

const InputAndLabel = require("./input_and_label");
const InputAndLabelWithButtonUni = require("./input_and_label_with_button_uni");
const ColorPicker = require("./color_picker");
const StandardButton = require("./standard_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const WORD_INPUT_BUTTON_DATA = require("../globalData/globals").WORD_INPUT_BUTTON_DATA;
const WordObjectClass =  require("../globalData/word_object");

const parseColorToNumbers = require("../utils/utils").parseColorToNumbers;
const checkColorLightOrDark = require("../utils/utils").checkColorLightOrDark;

const removeWhitespacesFromStartAndEnd = require("../utils/utils").removeWhitespacesFromStartAndEnd;

const WORD_ADD_MODE = require("../globalData/globals.js").WORD_ADD_MODE;
const WORD_UPDATE_MODE = require("../globalData/globals.js").WORD_UPDATE_MODE;


module.exports = class AddEditWordDialog{
    constructor(pContainer, controler){
        this.parentContainer = pContainer;
        this.controler = controler;

        //------------------bind functions-------------------------------
        this.onButtonClick = this.onButtonClick.bind(this);
        this.positionDialog = this.positionDialog.bind(this);
        this.onNewCategoryAdded = this.onNewCategoryAdded.bind(this);
        this.onDeletePressedHandler = this.onDeletePressedHandler.bind(this);
        this.setSaveButtonActive = this.setSaveButtonActive.bind(this);
        this.setColor = this.setColor.bind(this);
        this.onDeleteMeaningPressedHandler = this.onDeleteMeaningPressedHandler.bind(this);
        this.forceSaveWord = this.forceSaveWord.bind(this);

        this.MODE;
        this.willForceSave;

        this.OPENED = false;
      
        //------------------------------------------------------------

        //-------------------------handlers-------------------------
        this.onSaveHandler;
        this.onUpdateHandler;
        this.onAddCategoryHandler;
        this.onCancelHandler;

        //--------------data------------------
        this.wordObject;
        this.tempWordObject;

        //--------------interface elements----------------
        this.container;
        this.wordSection;
        this.wordField;
        this.wordMeaningField;
        this.buttonContainer;
        this.newCategoryBtn;
        this.saveUpdateButton;
        this.closeButton;
        this.categoryContainer;

        this.currentColor = "rgb(0, 0, 0)";

        //-------------group references------------------------
        this.categoryFields = [];
        this.meaningFields = [];
        this.otherElements = [];
        this.buttons = [];
        //---------------------------------------------------
        
        this.create();
    }

    //---------------------DOM interface functions------------------------------------

    create() {
        this.screenBkg = document.createElement("div");
        this.screenBkg.className = CLASS_NAMES.GlobalTransparentBkg;

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.EditWordBkgClassName;
        this.screenBkg.appendChild(this.container);

        this.dialogTitle = document.createElement("div");
        this.dialogTitle.className = CLASS_NAMES.LabelClass;
        this.dialogTitle.innerText = "Add/Edit Word Dialog";
        this.container.appendChild(this.dialogTitle);

        this.wordSection = this.createHTMLElement("div", CLASS_NAMES.WordContainerClassName);
        this.container.appendChild(this.wordSection);

        this.wordField = this.addBaseField("New Word", this.wordSection);
        this.colorPicker = new ColorPicker(this.wordSection, this.setColor);
        this.wordMeaningField = this.addBaseField("Meaning", this.wordSection);

        var line = document.createElement("br");
        this.wordSection.appendChild(line);

        this.addMeaningButton = new StandardButton("Add Meaning", this.onButtonClick, CLASS_NAMES.CustomButtonClassName, "ADD_MEANING_ID");
        this.addMeaningButton.setStyleProperty("width", "7rem");
        this.addMeaningButton.setStyleProperty("height", "3rem");
        this.addMeaningButton.setStyleProperty("marginTop", "1rem");
        this.addMeaningButton.addToContainer(this.wordSection);

        this.meaningsContainer = this.createHTMLElement("div", CLASS_NAMES.WordInputCategorySeparatorClassName);
        this.meaningsContainer.style.marginTop = "1rem";
        this.meaningsContainer.innerText = "Secondary Meanings:";
        this.wordSection.appendChild(this.meaningsContainer);

        this.newCategoryBtn = new StandardButton(WORD_INPUT_BUTTON_DATA.NewCategoryText, this.onButtonClick, CLASS_NAMES.CustomButtonClassName, WORD_INPUT_BUTTON_DATA.NewCategoryBtnID);
        this.newCategoryBtn.setStyleProperty("width", "7rem");
        this.newCategoryBtn.setStyleProperty("height", "3rem");
        this.newCategoryBtn.setStyleProperty("margin", "1rem");
        this.newCategoryBtn.addToContainer(this.container);

        this.categoryContainer = this.createHTMLElement("div", CLASS_NAMES.WordInputCategorySeparatorClassName);
        this.categoryContainer.style.width = "90%";
        this.container.appendChild(this.categoryContainer);

        var categoryLabel = document.createElement("div");
        categoryLabel.innerText = "Categories:";
        this.categoryContainer.appendChild(categoryLabel);

        this.buttonContainer = this.createHTMLElement("div");
        this.buttonContainer.style.width = "70%";
        this.buttonContainer.style.textAlign = "center";
        this.buttonContainer.style.margin = "auto";
        this.container.appendChild(this.buttonContainer);

        this.saveUpdateButton = new StandardButton(WORD_INPUT_BUTTON_DATA.SaveBtnText, this.onButtonClick, CLASS_NAMES.CustomButtonClassName, WORD_INPUT_BUTTON_DATA.SaveBtnID);
        this.saveUpdateButton.setStyleProperty("width", "9rem");
        this.saveUpdateButton.setStyleProperty("height", "2rem");
        this.saveUpdateButton.setStyleProperty("marginTop", "1rem");
        this.saveUpdateButton.setButtonColor("rgb(255, 96, 0)");
        this.saveUpdateButton.addToContainer(this.buttonContainer);

        this.saveAndCloseButton = new StandardButton("Save and Close", this.onButtonClick, CLASS_NAMES.CustomButtonClassName, "SAVE_AND_CLOSE_ID");
        this.saveAndCloseButton.setStyleProperty("width", "9rem");
        this.saveAndCloseButton.setStyleProperty("height", "2rem");
        this.saveAndCloseButton.setStyleProperty("marginTop", "1rem");
        this.saveAndCloseButton.setButtonColor("rgb(255, 96, 0)");
        this.saveAndCloseButton.addToContainer(this.buttonContainer);

        this.closeButton = new StandardButton("X", this.onButtonClick, CLASS_NAMES.CustomButtonClassName, "CANCEL_ID");
        this.closeButton.setStyleProperty("position", "absolute");
        this.closeButton.setStyleProperty("top", "1rem");
        this.closeButton.setStyleProperty("right", "1rem");
        this.closeButton.setStyleProperty("width", "3rem");
        this.closeButton.setStyleProperty("height", "3rem");
        this.closeButton.addToContainer(this.container);
     
    }

    createHTMLElement(elementType, elementClass = null){
        var tempElement = document.createElement(elementType);
        tempElement.className = elementClass;
        this.otherElements.push(tempElement);
        return(tempElement);
     }

    setWordDataFields(wordObject){     
        this.clearCategoryFields();
        this.clearMeaningFields();

        this.wordField.setText(wordObject.word);
        this.wordMeaningField.setText(wordObject.meanings[0]);

        for(let i = 1; i < wordObject.meanings.length; i++){
            var meaningField = this.addMeaningField("secondary meaning", this.meaningsContainer, CLASS_NAMES.InputContainerClassName);
            meaningField.setText(wordObject.meanings[i]);
            this.meaningFields.push(meaningField);
        }

        for(let i = 0; i < wordObject.categories.length; i++){
            let tempCategoryField = this.addNewCategoryField(wordObject.categories[i].category,  this.categoryContainer, CLASS_NAMES.InputContainerClassName, wordObject.categories[i].value);  
            this.categoryFields.push(tempCategoryField);        
        }  
    }

    addBaseField(text, parent = this.wordSection, baseClass = CLASS_NAMES.InputContainerClassName, elementBefore = null){      
        text += ": ";
        let tempCategory = new InputAndLabel(baseClass, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, parent, text);
        tempCategory.setLabelFontColor("white");
        tempCategory.setBorderColor("white");
        tempCategory.setStyleProperty("width", "25rem");
        tempCategory.addToContainer(elementBefore);
        tempCategory.setEventListener("input", this.setSaveButtonActive);

        return(tempCategory);
    }

    addNewCategoryField(text, parent = this.categoryContainer, baseClass = CLASS_NAMES.InputContainerClassName, value = null, elementBefore = null){      
        let tempCategory = new InputAndLabelWithButtonUni(baseClass, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, parent, 
        text, "", this.onDeletePressedHandler, "delete");
        if(value){
            tempCategory.setText(value);
        }
        tempCategory.setStyleProperty("margin", "0.2rem auto");
        tempCategory.setLabelFontColor("white");
        tempCategory.setBorderColor("white");
        tempCategory.setWidth("30rem");
        tempCategory.addToContainer();
        tempCategory.setEventListener("input", this.setSaveButtonActive);

        return(tempCategory);
    }

    addMeaningField(text, parent = this.meaningsContainer, baseClass = CLASS_NAMES.InputContainerClassName){      
        text += ": ";
        let tempCategory = new InputAndLabelWithButtonUni(baseClass, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            parent, text, "", this.onDeleteMeaningPressedHandler, "delete");
        tempCategory.setLabelFontColor("white");
        tempCategory.setBorderColor("white");
        tempCategory.setWidth("30rem");
        tempCategory.addToContainer();
        tempCategory.setEventListener("input", this.setSaveButtonActive);

        return(tempCategory);
    }

    clearCategoryFields(){
       for(let i = 0; i < this.categoryFields.length; i++)
       {
           this.categoryFields[i].clear(); 
       } 
       
       this.categoryFields = [];
    }

    clearMeaningFields(){
        for(let i = 0; i < this.meaningFields.length; i++)
        {
            this.meaningFields[i].clear(); 
        } 
        
        this.meaningFields = [];
    }

    onDeleteMeaningPressedHandler(params){
        for(let i = 0; i < this.meaningFields.length; i++){
            if(this.meaningFields[i].fieldId === params.fieldId){
                this.meaningFields[i].clear(); 
                this.meaningFields.splice(i, 1);
                this.setSaveButtonActive();
                return;
            }
        }
    }

    onNewCategoryAdded(newCategoryName){
        if(newCategoryName){
             let tempFields = this.addNewCategoryField(newCategoryName, this.categoryContainer, 
                CLASS_NAMES.InputContainerWithButtonClassName, null, this.newCategoryBtn.getContainer());
             this.categoryFields.push(tempFields);
             this.setSaveButtonActive();
        }
     }

    addToContainer(){
        if(!this.screenBkg.parentNode)
        {
            this.screenBkg.style.opacity = 0;
            this.screenBkg.style.animation = "elementAnimationFadeIn 0.3s forwards";
            this.parentContainer.appendChild(this.screenBkg);
            this.OPENED = true;
        }
    }

    removeFromContainer(){
        if(this.screenBkg.parentNode)
        {
            this.parentContainer.removeChild(this.screenBkg);
            this.OPENED = false;
        }            
    }

    setSaveButtonActive(){      
        if(this.wordField.getText() !== "" && this.wordMeaningField.getText() !== ""){
            this.saveUpdateButton.setButtonActive();
            this.saveAndCloseButton.setButtonActive();
        }
        else{
            this.setSaveButtonInactive();
        }
    }

    setSaveButtonInactive(immediately = false){
        if(immediately){
            this.saveUpdateButton.setButtonInactive();
            this.saveAndCloseButton.setButtonInactive();
            return;
        }

        var that = this;      
        setTimeout(function(){
                that.saveUpdateButton.setButtonInactive();
                that.saveAndCloseButton.setButtonInactive();
                    }, 500);          
    }

    //----------------------------------------end DOM interface functions-----------------------------

    //--------------------------------------event handlers, callbacks-----------------------------------------
    onButtonClick(id, button){
        if(id === WORD_INPUT_BUTTON_DATA.SaveBtnID){
            this.setSaveButtonInactive();

            if(this.mode === WORD_ADD_MODE)
            {
                this.saveNewWord();
            }
            else if(this.mode === WORD_UPDATE_MODE)
            {
                this.updateWord();
            }
        }
        else if(id === "CANCEL_ID"){
            if(this.onCancelHandler){
                this.onCancelHandler();
            }
        }       
        else if(id === WORD_INPUT_BUTTON_DATA.NewCategoryBtnID){
            if(this.onAddCategoryHandler){
                this.onAddCategoryHandler();
            }
        }
        else if(id === "ADD_MEANING_ID"){
            this.meaningFields.push(this.addMeaningField("secondary meaning", this.meaningsContainer, 
            CLASS_NAMES.InputContainerClassName));
        }
        if(id === "SAVE_AND_CLOSE_ID"){
            this.setSaveButtonInactive();

            if(this.mode === WORD_ADD_MODE)
            {
                this.saveNewWord();
            }
            else if(this.mode === WORD_UPDATE_MODE)
            {
                this.updateWord();
            }

            if(this.onCancelHandler){
                this.onCancelHandler();
            }
        }
    }


    onDeletePressedHandler(params){
        for(let i = 0; i < this.categoryFields.length; i++)
        {
            if(this.categoryFields[i].fieldId === params.fieldId){
                this.categoryFields[i].removeFromContainer();
                this.categoryFields.splice(i, 1);
                this.tempWordObject = this.getWordObject();
                this.setWordDataFields(this.tempWordObject);
                this.setSaveButtonActive();
                return;
            }                            
        }
    }

    setColor(color, justPositioning = false){
        if(!justPositioning){
            this.currentColor = color;
            this.wordField.setInputFieldColor(color);
            this.setWordFieldBkgColor(color);
            this.setSaveButtonActive();
        }

        this.positionDialog();
    }

    setWordFieldBkgColor(color){
        var bkgColor;
        if(checkColorLightOrDark(parseColorToNumbers(color))){
            bkgColor = "rgb(16, 17, 20)";
        }
        else{
            bkgColor =  "rgb(182, 194, 204)";
        }

        this.wordField.setBackgroundColor(bkgColor);
    }

    positionDialog(e){
        var dWidth = this.container.clientWidth;
        var dHeight = this.container.clientHeight;

        var left = (window.innerWidth - dWidth)/2;
        //var top = (window.innerHeight - dHeight)/2;
        var top = 20;

        this.container.style.top = top + "px";
        this.container.style.left = left + "px";
    }

    //-------------------------------end event handlers, callbacks----------------------------------
  
    //------------------------save update functions-------------------------------------

    saveNewWord(){       
        var newWordObject = this.getWordObject();

        if(!this.validateNewWordInput(newWordObject)){
            if(this.onSaveFailedHandler){
                this.onSaveFailedHandler("Word save failed, word or meaning not set.");
            }
            return;  
        }

       var saved =  this.onSaveHandler(newWordObject, this.willForceSave);
       if(!saved){
           this.controler.openMessageBoxYesNo("Word exists in database. Overrite?", this.forceSaveWord, null, [newWordObject], null);
       }
    }

    forceSaveWord(newWordObject){
        this.willForceSave = true;
        this.onSaveHandler(newWordObject, true);
    }

    updateWord(){
        var updatedWordObject = this.getWordObject();

        if(!this.validateNewWordInput(updatedWordObject)){
            if(this.onSaveFailedHandler){
                this.onSaveFailedHandler("Word save failed, word or meaning not set.");
            }
            return; 
        }

        this.onUpdateHandler(updatedWordObject);
    }

    validateNewWordInput(newWordInput){
        if(newWordInput && newWordInput.word && newWordInput.word != "" && newWordInput.meanings[0] && newWordInput.meanings[0] != "")
        {
            return(true);
        }
        else
        {
            return(false);
        }
    }

    getWordObject(){
        var currentWord = removeWhitespacesFromStartAndEnd(this.wordField.getText());
        var mainMeaning = removeWhitespacesFromStartAndEnd(this.wordMeaningField.getText());

        var allMeanings = [];

        for(let i = 0; i < this.meaningFields.length; i++){
            let meaningText = removeWhitespacesFromStartAndEnd(this.meaningFields[i].getText());
            if(meaningText != ""){
                allMeanings.push(meaningText);
            }        
        }

        allMeanings.unshift(mainMeaning)

        var categoriesArray = [];
        for(let i = 0; i < this.categoryFields.length; i++)
        {
            let categoryObject = {
                category: this.categoryFields[i].getName(),
                value: removeWhitespacesFromStartAndEnd(this.categoryFields[i].getText()),
            }

            categoriesArray.push(categoryObject);
        }
        var currentWordId;
        var date;
        var marked;
        if(this.wordObject)
        {
            currentWordId = this.wordObject.wordId;
            date = this.wordObject.date;
            marked = this.wordObject.marked;
        }
        else
        {
            currentWordId = shortid.generate();
            date = new Date().getTime();
            marked = false;
        }
        /*var newWordObject = {
            word:currentWord,
            meanings: allMeanings,          
            wordId: currentWordId,
            wordColor: this.currentColor,
            date: date,
            categories: categoriesArray                                            
        }*/

        var newWordObject = new WordObjectClass(currentWord, allMeanings, currentWordId, this.currentColor, date, categoriesArray, marked);

        return(newWordObject);
    }

    //------------------------end save update functions-------------------------------------

    open(params){       
            this.close();

            window.addEventListener("resize", this.positionDialog);

            this.currentColor = "rgb(0, 0, 0)";

            if(params.wordObject)  // edit word case
            { 
                this.wordObject = params.wordObject; 
                if(this.wordObject.wordColor){
                    this.wordField.setInputFieldColor(this.wordObject.wordColor); 
                    this.currentColor = this.wordObject.wordColor;     
                }
                else{
                    this.wordField.setInputFieldColor(this.currentColor);
                }
                            
                this.saveUpdateButton.innerText = "Update";
                this.setWordDataFields(this.wordObject);   
               
            }
            else  // new word case
            {
                this.clearCategoryFields();
                this.clearMeaningFields();
                this.saveUpdateButton.innerText = "Save";
                this.wordField.setText("");
                this.wordMeaningField.setText("");               
            }
    
            this.onSaveHandler = params.onSaveWord;      
            this.onUpdateHandler = params.onUpdateWord;  
            this.onAddCategoryHandler = params.onAddCategory;
            this.onCancelHandler = params.onCloseAddEditWord;
            this.onSaveFailedHandler = params.onSaveFailed;

            this.mode = params.mode;

            this.wordField.setInputFieldColor(this.currentColor);
            this.setWordFieldBkgColor(this.currentColor);

            this.setSaveButtonInactive(true);
            
            this.addToContainer();
            this.positionDialog(null);     
    }

    close(){
        window.removeEventListener("resize", this.positionDialog);
        this.clearCategoryFields();
        this.clearMeaningFields();
        this.setSaveButtonInactive(true);
        this.onSaveChangesHandler = null;
        this.removeFromContainer();
        this.wordObject = null;
        this.willForceSave = false;
    }
}