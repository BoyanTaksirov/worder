const InputAndLabel = require("./input_and_label");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class WordDetailsExam{
    constructor(pContainer){
        this.parentContainer = pContainer;
        this.settingsObject;
        this.meanings = [];
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
        this.container.style.width = "70%";
        this.container.style.display = "inline-block";
        this.container.style.margin = "0.2rem 1rem";

       
        
        this.word = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.container, "word:");
            this.word.setStyleProperty("margin", "1rem auto");
            //this.word.setStyleProperty("display", "inline-block");          ??????????????????
        this.word.setIfEditable(false);
        this.word.addToContainer();
    
        this.meaning = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.container, "meaning:");
            this.meaning.setStyleProperty("margin", "1rem auto");
        this.meaning.setIfEditable(false);
        this.meaning.addToContainer();

        this.meaningsContainer = document.createElement("div");
        this.meaningsContainer.className =  CLASS_NAMES.StandardContainer;
        this.meaningsContainer.style.marginBottom = "1rem";
        this.meaningsContainer.innerText = "additional meanings:";
     
        this.categoriesContainer = document.createElement("div");
        this.categoriesContainer.className =  CLASS_NAMES.StandardContainer;
        this.categoriesContainer.style.marginBottom = "1rem";
        this.categoriesContainer.innerText = "categories:";

        this.addToContainer();
    }

    setSettings(settingsObject){
        this.settingsObject = settingsObject;
    }

    setPrimaryFields(){
        if(this.settingsObject.guessWord){
            this.word.hide();
            this.meaning.show();
            this.meaning.setText(this.wordObject.meanings[0]);
        }
        else{
            this.word.show();
            this.meaning.hide();
            this.word.setText(this.wordObject.word);
            if(this.wordObject.wordColor){
                this.word.setInputFieldColor(this.wordObject.wordColor);
             }    
        }
    }

    showAllFields(){  
        this.word.show();
        this.word.setText(this.wordObject.word);
        if(this.wordObject.wordColor && this.wordObject.wordColor !== ""){
            this.word.setStyleProperty("color", this.wordObject.wordColor);
        }
        
        this.meaning.show();
        this.meaning.setText(this.wordObject.meanings[0]);

        if(this.wordObject.meanings.length > 1){
            this.container.appendChild(this.meaningsContainer);
        }

        for(let i = 1; i < this.wordObject.meanings.length; i++){
            let tempMeaningField = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
                this.meaningsContainer, "secondary meaning"  + ":", this.wordObject.meanings[i]);
                tempMeaningField.setIfEditable(false);
                tempMeaningField.addToContainer();
            this.meanings.push(tempMeaningField);
         }

         if(this.settingsObject.categoriesSelected){
            for(var i = 0; i < this.settingsObject.categoriesSelected.length; i++){
                for(var c = 0; c < this.wordObject.categories.length; c++){
                    if(this.settingsObject.categoriesSelected[i] === this.wordObject.categories[c].category){
                        if(!this.categoriesContainer.parentNode){
                            this.container.appendChild(this.categoriesContainer);
                        }
                        var tempLabel = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName,
                            this.categoriesContainer, this.wordObject.categories[c].category  + ":", this.wordObject.categories[c].value);
                            tempLabel.setIfEditable(false);
                            tempLabel.addToContainer();
                        this.categoryLabels.push(tempLabel);
                    }
                }
            }
        }
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
        if(this.meaningsContainer.parentNode){
            this.container.removeChild(this.meaningsContainer);
        }
        if(this.categoriesContainer.parentNode){
            this.container.removeChild(this.categoriesContainer);
        }
      
        for(var i = 0; i < this.meanings.length; i++){
            this.meanings[i].clear();
        }

        this.meanings = [];

        for(var i = 0; i < this.categoryLabels.length; i++){
            this.categoryLabels[i].clear();
        }

        this.categoryLabels = [];
    }

    reset(){
        this.wordObject = null;
        this.word.setText("");
        this.meaning.setText("");

        this.clearSecondaryFields();
    }

    open(wordObject){
        this.wordObject = wordObject;
        this.clearFields();
        this.setPrimaryFields();       
    }

    clear(){
        this.word.setText("");
        this.meaning.setText("");
        this.clearFields();
        this.removeFromContainer();
    }
}