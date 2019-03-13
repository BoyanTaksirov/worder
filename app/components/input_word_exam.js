const InputAndLabel = require("./input_and_label");
const StandardButton = require("./standard_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class InputWordExam{
    constructor(pContainer, onSubmitHandler, onContinueHandler){
        this.parentContainer = pContainer;

        this.onSubmitHandler = onSubmitHandler;
        this.onContinueHandler = onContinueHandler;

        this.onSubmit = this.onSubmit.bind(this);
        this.onKeySubmit = this.onKeySubmit.bind(this);
        this.onContinue = this.onContinue.bind(this);
       
        this.settingsObject;
        this.categoryLabels = [];
        this.create();
    }

    addToContainer(){
        if(!this.container.parentNode){       
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer(){
        if(this.container.parentNode){
            this.parentContainer.removeChild(this.container);
        }            
    }

    create(){
        this.container = document.createElement("div");
        this.container.style.overflowY = "auto";
        this.container.style.width = "90%";
        this.container.style.margin = "0.2rem auto";
        this.word = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.container, "Input word:");
            this.word.setStyleProperty("margin", "1rem auto");
            this.word.setEventListener("keypress", this.onKeySubmit);
        this.word.addToContainer();

        this.meaning = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.container, "Input meaning:");
            this.meaning.setStyleProperty("margin", "1rem auto");
            this.meaning.setEventListener("keypress", this.onKeySubmit);
        this.meaning.addToContainer();

        this.categoriesContainer = document.createElement("div");
        this.categoriesContainer.className =  CLASS_NAMES.StandardContainer;
        this.categoriesContainer.style.display = "none";
        this.categoriesContainer.style.marginBottom = "1rem";
        this.categoriesContainer.innerText = "categories:";
      
        this.container.appendChild(this.categoriesContainer);

        this.submitButton = new StandardButton("submit", this.onSubmit);
        this.submitButton.setStyleProperty("display", "block");
        this.submitButton.setStyleProperty("margin", "0 auto");
        this.submitButton.setStyleProperty("width", "7rem");
        this.submitButton.setStyleProperty("height", "3rem");
        this.submitButton.addToContainer(this.container);

        this.addToContainer();
    }

    setSettings(settings){
        this.settingsObject = settings;
    }

    setFields(){
        this.setPrimaryFields();
        this.setSecondaryFields();
    }

    setPrimaryFields(){
        if(this.settingsObject.guessWord){
            this.word.show();
            this.meaning.hide();           
            this.word.setInputFieldColor("rgb(40, 47, 60)");
            this.word.setIfEditable(true);
        }
        else{
            this.word.hide();
            this.meaning.show();
            this.meaning.setInputFieldColor("rgb(40, 47, 60)");
            this.meaning.setIfEditable(true);
        }
    }

    setSecondaryFields(){     
         if(this.settingsObject.categoriesSelected){
            for(var i = 0; i < this.settingsObject.categoriesSelected.length; i++){
                for(var c = 0; c < this.wordObject.categories.length; c++){
                    if(this.settingsObject.categoriesSelected[i] === this.wordObject.categories[c].category){
                        this.categoriesContainer.style.display = "block";
                        var tempLabel =  new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
                            this.categoriesContainer, "Input category " + this.wordObject.categories[c].category + ":");
                            tempLabel.setInputFieldColor("rgb(40, 47, 60)");
                            tempLabel.setCustomData({category: this.wordObject.categories[c].category});
                            this.categoryLabels.push(tempLabel);    
                            tempLabel.addToContainer();           
                    }
                }
            }
        }
    }

    reset(){
            this.wordObject = null;
            this.word.setText("");
            this.meaning.setText("");
    
            this.clearSecondaryFields();
    }

    clearFields(){
       this.clearPrimaryFields();
       this.clearSecondaryFields();
    }

    clearPrimaryFields(){
        this.word.setText("");
        this.word.hide();

        this.meaning.setText("");
        this.meaning.hide();
    }

    clearSecondaryFields(){
        for(var i = 0; i < this.categoryLabels.length; i++){
            this.categoryLabels[i].clear();
        }

        this.categoryLabels = [];

        if(this.categoriesContainer.parentNode){
           this.categoriesContainer.style.display = "none";
        }
    }

    getAnswer(){
        var wordMeaningAnswer = (this.settingsObject.guessWord)?this.word.getText():this.meaning.getText();
        var categoryAnswers = [];
        for(var i = 0; i < this.categoryLabels.length; i++){
            categoryAnswers.push({
                                    category: this.categoryLabels[i].customData.category,
                                    value: this.categoryLabels[i].getText()
                                 });
        }

        var answerObject = {
            wordMeaningAnswer: wordMeaningAnswer,
            categoryAnswers: categoryAnswers
        }

        return(answerObject);
    }

    onSubmit(e){
        this.onSubmitHandler(this.getAnswer());
    }

    onKeySubmit(e){
        if(e.keyCode === 13){
            this.onSubmitHandler(this.getAnswer());
        }
    }

    onContinue(e){
        this.onContinueHandler();
    }

    changeButtonToSubmitMode(){
        this.submitButton.setLabel("submit");
        this.submitButton.changeHandler(this.onSubmit);
    }

    changeButtonToContinueMode(){
        this.submitButton.setLabel("continue");
        this.submitButton.changeHandler(this.onContinue);
    }

    proceedToContinueMode(answerResultsObject){
        var answerColor = (answerResultsObject.wordOrMeaningOK)?"green":"red";
        if(this.settingsObject.guessWord){
            this.word.setInputFieldColor(answerColor);
            this.word.setIfEditable(false);
        }
        else{
            this.meaning.setInputFieldColor(answerColor);
            this.meaning.setIfEditable(false);
        }

        for(var i = 0; i < answerResultsObject.categoriesResults.length; i++){
            answerColor = (answerResultsObject.categoriesResults[i])?"green":"red";
            this.categoryLabels[i].setInputFieldColor(answerColor);

            this.categoryLabels[i].setIfEditable(false);
        }

        this.changeButtonToContinueMode();
    }

    setButtonMode(active = true){
        if(active){
            this.submitButton.setButtonActive();
        }
        else{
            this.submitButton.setButtonInactive();
        }     
    }

    open(wordObject){
        this.wordObject = wordObject;
        this.clearFields();
        this.setFields();
        this.setButtonMode(true);
        this.changeButtonToSubmitMode();
    }

    clear(){
        this.word.clear();
        this.meaning.clear();
        this.clearFields();
        this.removeFromContainer();
    }
}