const NameAndValue = require("./name_and_value");
const StateButton = require("./state_button");
const ButtonState = require("../states/button_state");
const InputField = require("./input_field");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class MeaningsDetails{
    constructor(pContainer, meanings){
        this.parentContainer = pContainer;
        this.container = document.createElement("div");
        this.container.style.position = "relative";
        this.addToContainer();
        this.meaningFields = [];

        this.onShowHideClicked = this.onShowHideClicked.bind(this);

        this.showHideContainer = document.createElement("div");
        this.showHideContainer.style.textAlign = "right";
        this.container.appendChild(this.showHideContainer);

        var showHideMeaningButtonStates = [
            new ButtonState("hide", CLASS_NAMES.SmallButtonClassState2, this.onShowHideClicked, null),
            new ButtonState("show", CLASS_NAMES.SmallButtonClass, this.onShowHideClicked, null),
        ];

        this.showHideButton = new StateButton(showHideMeaningButtonStates, "SHOW_HIDE_MEANING_ID");
        this.showHideButton.addToContainer(this.showHideContainer);

        this.setMeaningFields(meanings);      
    }

    setMeaningFields(meanings){
        for(let i = 0; i < meanings.length; i++){
        if( i === 0){ 
            var baseMField = new InputField(this.container, meanings[i], CLASS_NAMES.WordLabelClass);
            baseMField.setStyleProperty("display", "inline-block");
            baseMField.setInputFieldColor("rgb(27, 63, 103)");
            baseMField.setStyleProperty("fontWeight", "bold");
            baseMField.setStyleProperty("border", "");
            baseMField.setIfEditable(false);
            this.meaningFields.push(baseMField);
        }
        else{
            var secondaryMField = new InputField(this.container, "", CLASS_NAMES.WordLabelClass);
            secondaryMField.setStyleProperty("display", "inline-block");
            secondaryMField.setInputFieldColor("rgb(41, 55, 69)");
            secondaryMField.setStyleProperty("fontStyle", "italic");
            secondaryMField.setStyleProperty("border", "");
            secondaryMField.setText(meanings[i]);
            secondaryMField.setIfEditable(false);
            this.meaningFields.push(secondaryMField);
        }
    }
   }

   showMeaningFields(fromOutside = false){
    for(let i = 0; i < this.meaningFields.length; i++){ 
        this.meaningFields[i].show();
     }

     if(fromOutside){
        this.showHideButton.setState(0);
     }
   }

   hideMeaningFields(fromOutside = false){
    for(let i = 0; i < this.meaningFields.length; i++){ 
        this.meaningFields[i].hide();
     }

     if(fromOutside){
         this.showHideButton.setState(1);
     }
   }

   onShowHideClicked(state){
        if(state === 0){
            this.hideMeaningFields();
        }
        else if(state === 1){
            this.showMeaningFields();
        }
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

   clear(){
        this.showHideButton.clear();
        this.removeFromContainer();
        for(let i = 1; i < this.meaningFields.length; i++){           
            this.meaningFields[i].clear();        
        }
   }
}