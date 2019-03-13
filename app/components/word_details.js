const NameAndValue = require("./name_and_value");
const InputField = require("./input_field");
const StateButton = require("./state_button");
const ButtonState = require("../states/button_state");
const getMonthName = require("../utils/utils").getMonthName;
const prependZero = require("../utils/utils").prependZero;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const parseColorToNumbers = require("../utils/utils").parseColorToNumbers;
const checkColorLightOrDark = require("../utils/utils").checkColorLightOrDark;

module.exports = class WordDetails{
    constructor(pContainer, wordObject, settingsObject){
        this.parentContainer = pContainer;
        this.categoryLabels = [];

        this.onShowHideClicked = this.onShowHideClicked.bind(this);
        this.onShowHideCategoriesClicked = this.onShowHideCategoriesClicked.bind(this);

        this.wordObject = wordObject;

        this.create(wordObject, settingsObject);
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

    create(wordObject, settingsObject){
         this.container = document.createElement("div");
         this.showHideContainer = document.createElement("div");
         this.showHideContainer.style.textAlign = "right";
         this.container.appendChild(this.showHideContainer);

         var showHideCtgButtonStates = [
             new ButtonState("show ctg", CLASS_NAMES.SmallButtonClass, this.onShowHideCategoriesClicked, null),
             new ButtonState("hide ctg", CLASS_NAMES.SmallButtonClassState2, this.onShowHideCategoriesClicked, null),
         ]
 
         this.showHideCategoriesButton = new StateButton(showHideCtgButtonStates, "SHOW_HIDE_CATEGORIES_ID");
         this.showHideCategoriesButton.setStyleProperty("width", "4rem");
         if(!wordObject.categories || wordObject.categories.length <= 0){
            this.showHideCategoriesButton.setButtonInactive();
         }
         this.showHideCategoriesButton.addToContainer(this.showHideContainer);

         var showHideWordButtonStates = [
            new ButtonState("hide", CLASS_NAMES.SmallButtonClassState2, this.onShowHideClicked, null),
            new ButtonState("show", CLASS_NAMES.SmallButtonClass, this.onShowHideClicked, null),
        ]

         this.showHideButton = new StateButton(showHideWordButtonStates, "SHOW_HIDE_WORD_ID");
         this.showHideButton.addToContainer(this.showHideContainer);

         this.word = new InputField(this.container, wordObject.word, CLASS_NAMES.WordLabelClass);
         this.word.setStyleProperty("display", "inline-block");
         this.word.setInputFieldColor("rgb(27, 63, 103)");
         this.word.setStyleProperty("fontWeight", "bold");
         this.word.setStyleProperty("border", "");
         this.word.setIfEditable(false);

         if(wordObject.wordColor){
            this.word.setInputFieldColor(wordObject.wordColor);
            var colorArray = parseColorToNumbers(wordObject.wordColor);
            if(checkColorLightOrDark(colorArray)){
                this.word.setBackgroundColor("rgb(34, 34, 34)");
            }
            else{
                this.word.setBackgroundColor("none");
            }
         }
       
            this.categoriesLabel = document.createElement("div");
            this.categoriesLabel.className =  CLASS_NAMES.WordDetailsCategory;
            this.categoriesLabel.innerText = "categories:";
            this.categoriesLabel.style.fontSize = "1rem";
            this.categoriesLabel.style.fontStyle = "italic";
            this.categoriesLabel.style.display = "none";
            this.container.appendChild(this.categoriesLabel);  

        if(settingsObject && settingsObject.categoriesSelected){
                for(var i = 0; i < settingsObject.categoriesSelected.length; i++){
                    for(var c = 0; c < wordObject.categories.length; c++){
                        if(settingsObject.categoriesSelected[i] === wordObject.categories[c].category){
                            if(this.categoriesLabel.style.display === "none"){
                                this.categoriesLabel.style.display = "block";
                            }
                            var tempLabel = new NameAndValue(this.categoriesLabel, wordObject.categories[c].category  + ":", wordObject.categories[c].value);
                            tempLabel.setNameFieldColor("rgb(35, 35, 35)");
                            tempLabel.setInputFieldColor("rgb(35, 35, 35)");
                            this.categoryLabels.push(tempLabel);
                        }
                    }
                }

                if(this.categoryLabels.length === wordObject.categories.length){
                    this.showHideCategoriesButton.setState(1);
                }
            }

        if(settingsObject && settingsObject.showDate){
            this.wordDate = document.createElement("div");
            this.wordDate.className = CLASS_NAMES.WordDateClass;
            let date = new Date(parseInt(wordObject.date));
            this.wordDate.innerText = date.getFullYear() + "-" + getMonthName(date.getMonth()) + "-" + prependZero(date.getDate()) + ", time: " + 
            prependZero(date.getHours()) + ":" +  prependZero(date.getMinutes());
            this.container.appendChild(this.wordDate);
        }

        this.addToContainer();
    }

    showWordFields(fromOutside = false){        
         this.word.show();
         this.categoriesLabel.style.visibility = "visible"; 
         
         if(fromOutside){
            this.showHideButton.setState(0);
         }       
       }
    
       hideWordFields(fromOutside = false){
         this.word.hide();
         this.categoriesLabel.style.visibility = "hidden"; 
         
         if(fromOutside){
            this.showHideButton.setState(1);
         }       
       }
    
       onShowHideClicked(state){
            if(state === 0){
                this.hideWordFields();
            }
            else if(state === 1){
                this.showWordFields();
            }
       }

       onShowHideCategoriesClicked(state){
          if(state === 0){
              this.showAllCategories();
          }
          else if(state === 1){
              this.hideAllCategories();
          }
       }

       showAllCategories(buttonUpdate = false){
           if(this.wordObject.categories.length <= 0){
               return;
           }

           this.hideAllCategories();
           this.categoriesLabel.style.display = "block";

            for(var c = 0; c < this.wordObject.categories.length; c++){                                
                var tempLabel = new NameAndValue(this.categoriesLabel, this.wordObject.categories[c].category  + ":", this.wordObject.categories[c].value);
                tempLabel.setNameFieldColor("rgb(35, 35, 35");
                tempLabel.setInputFieldColor("rgb(35, 35, 35");
                this.categoryLabels.push(tempLabel);                   
            }

            if(buttonUpdate){
                this.showHideCategoriesButton.setState(1, false);
            }       
       }

       hideAllCategories(){
            for(var i = 0; i < this.categoryLabels.length; i++){
                this.categoryLabels[i].clear();
            }
            this.categoryLabels = [];

            this.categoriesLabel.style.display = "none";         
       }

    clear(){
        this.word.clear();
        this.showHideButton.clear();
        this.showHideCategoriesButton.clear();
        this.removeFromContainer();
    }


}