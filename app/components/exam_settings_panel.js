const shortid = require('shortid'); 

const InputAndLabel = require("./input_and_label");
const InputAndLabelHorizontal = require("./input_and_label_horizontal");
const CheckBox = require("./check_box");
const CategorySelector = require("./category_selector");
const StandardButton = require("./standard_button")
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const RadioButtons = require("./radio_buttons_group");


module.exports = class ExamSettingsPanel{
    constructor(pContainer, controler, okHandler){
        this.parentContainer = pContainer;
        this.controler = controler;
        this.okHandler = okHandler;

        this.onOkAndStart = this.onOkAndStart.bind(this);
        this.onTargetWordChosen = this.onTargetWordChosen.bind(this);
        this.onMeaningWordChosen = this.onMeaningWordChosen.bind(this);

        this.create();
    }

    create(){

        var bkgColor = "rgb(133, 180, 219)";

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.FlexibleStandardContainer;
        this.container.style.backgroundColor = bkgColor;
        this.container.style.padding = "1rem";
        this.container.style.width = "35rem";
        this.container.style.margin = "1rem auto";

        var buttonsData = [
            {
                buttonId: "WORD_ID",
                groupName: "examType",
                buttonName: "Guess Word",
                checked: true
            }, 
            {
                buttonId: "MEANING_ID",
                groupName: "examType",
                buttonName: "Guess Meaning",
                checked: false
            }, 
        ]

        this.examTypeRadioButtons = new RadioButtons(this.container, buttonsData);

        this.categorySelector = new CategorySelector(this.container);
        this.categorySelector.setStyleProperty("margin", "1rem");

        this.questionsCountField = new InputAndLabelHorizontal(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.container, "Questions Count:");

        this.questionsCountField.setStyleProperty("display", "block");
        this.questionsCountField.setStyleProperty("width", "20rem");
        this.questionsCountField.setStyleProperty("margin", "auto");

        this.questionsCountField.setText(this.controler.getExamQuestionsCount());

        this.startButton = new StandardButton("OK & Start", this.onOkAndStart);
        this.startButton.setStyleProperty("width", "7rem");
        this.startButton.setStyleProperty("height", "3rem");
    }

     onTargetWordChosen(e){

     }

     onMeaningWordChosen(e){

    }

    onOkAndStart(e){
        var guessWord = false;
        if(this.examTypeRadioButtons.getSelectedRadioButtonId() === "WORD_ID"){
            guessWord = true;
        }
        var settings = {
            guessWord: guessWord,
            numQuestions: parseInt(this.questionsCountField.getText()),
            categoriesSelected: this.categorySelector.getSelectedCategories(),
        }
        this.okHandler(settings);
    }

    addToContainer(){
        if(!this.container.parentNode)
        {
            this.parentContainer.appendChild(this.container);
            this.OPENED = true;
        }
    }

    addBefore(element){
        if(!this.container.parentNode)
        {
            this.parentContainer.insertBefore(this.container, element);
            this.OPENED = true;
        }
    }

    removeFromContainer(){
        if(this.container.parentNode)
        {
            this.parentContainer.removeChild(this.container);
            this.OPENED = false;
        }
    }

    close(){
        this.removeFromContainer();
    }

    clear(){
        this.startButton.clear();
        this.categorySelector.clear();
        this.questionsCountField.clear();
        this.examTypeRadioButtons.clear();
        this.removeFromContainer();
    }

    update(){
        this.categorySelector.open(this.controler.getCategories());  
    }

    open(){
        this.examTypeRadioButtons.addToContainer();
        this.categorySelector.open(this.controler.getCategories());     
        this.questionsCountField.addToContainer();
        this.container.appendChild(document.createElement("br"));
        this.startButton.addToContainer(this.container);

        this.addToContainer();
    }
}

