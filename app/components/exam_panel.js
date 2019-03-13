const WordDetailsExam = require("./word_details_exam");
const InputWordExam = require("./input_word_exam");
const StateButton = require("./state_button");
const ButtonState = require("../states/button_state");
const InfoTable = require("./info_table");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const StandardButton = require("./standard_button");
const Timer = require("../utils/timer");
const removeWhitespacesFromStartAndEnd = require("../utils/utils").removeWhitespacesFromStartAndEnd;

const SCORE = "score:";
const WORDS_GUESSED = "words guessed:";
const WORDS_WRONG = "words wrong:";
const CURRENT_ANSWER = "Current Answer";
const QUESTION_NUMBER = "question number:";

const EXAM_STATES = {
    WAITING_ANSWER: "WAITING_ANSWER",
    ANSWER_RESULT: "ANSWER_RESULT",
    END_EXAM: "END_EXAM"
}


module.exports = class ExamPanel{
    constructor(pContainer, onExitExamHandler, controler){
         this.parentContainer = pContainer;
         this.controler = controler;
         this.wordObject;

         this.examState = EXAM_STATES.WAITING_ANSWER;

         this.onSubmitAnswer = this.onSubmitAnswer.bind(this);
         this.onOkCancelPressed = this.onOkCancelPressed.bind(this);
         this.onExitExam = this.onExitExam.bind(this);
         this.continueWithNextQuestion = this.continueWithNextQuestion.bind(this);
         this.checkForCategoryMatch = this.checkForCategoryMatch.bind(this);
         this.onMarkPressed = this.onMarkPressed.bind(this);
         this.showMarkTooltip = this.showMarkTooltip.bind(this);
         this.hideMarkTooltip = this.hideMarkTooltip.bind(this);

         this.onExitExamHandler = onExitExamHandler;

         this.container = document.createElement("div");
         this.container.className = CLASS_NAMES.FlexibleStandardContainer;
         this.container.style.position = "relative";
         this.container.style.width = "50rem";
         this.container.style.margin = "1rem auto";
         this.container.style.overflowY = "auto";

        //-----------------exam variables-------------------

         this.score = 0;
         this.wordsGuessed = 0;
         this.wordsWrong = 0;

         this.currentWord = 0;
         this.indexesArray = [];
         this.indexesArray = this.setIndexesArray();

         this.infoTable = new InfoTable(this.container);

         var infoArray = [{name: QUESTION_NUMBER, value: 0}, {name: SCORE, value: 0}, {name: WORDS_GUESSED, value: 0}, {name: WORDS_WRONG, value: 0}, 
           {name: CURRENT_ANSWER, value: "NOT SET"}];
         this.infoTable.setInfoFields(infoArray);

         this.examTimer = new Timer(1000);
         this.examTimer.setDisplayWidth("25rem");
         this.examTimer.setBorder("2px  solid rgb(0, 176, 255)");
         this.examTimer.setBkgColor("rgb(36 59 69");
         this.examTimer.addToContainer(this.container);

         this.examTimer.setStyleProperty("display", "inline-block");

         this.tableContainer = document.createElement("table");
         this.tableContainer.className = CLASS_NAMES.TableClassName;
         this.tableRow = document.createElement("tr");
         this.tableContainer.appendChild(this.tableRow);
         this.tableCellLeft = document.createElement("th");
         this.tableCellLeft.style.width = "50%";
         this.tableCellLeft.style.verticalAlign = "top";
         this.tableCellLeft.style.borderRight = "2px solid rgb(0, 42, 78)";
         this.tableRow.appendChild(this.tableCellLeft);
         this.tableCellRight = document.createElement("th");
         this.tableCellRight.style.verticalAlign = "top";
         this.tableCellRight.style.width = "50%";
         this.tableRow.appendChild(this.tableCellRight);
         this.container.appendChild(this.tableContainer);

         var markerButtonStates = [
            new ButtonState("!", CLASS_NAMES.WordMarkerSmall, this.onMarkPressed, null),
            new ButtonState("!", CLASS_NAMES.WordMarkerSmallActive, this.onMarkPressed, null),
        ];

         this.markerButton = new StateButton(markerButtonStates, "MARKER_BUTTON_ID");
         this.markerButton.setStyleProperty("width", "2rem");
         this.markerButton.setStyleProperty("height", "2.5rem");
         this.markerButton.setStyleProperty("fontSize", "1.5rem");
         this.markerButton.setStyleProperty("verticalAlign", "top");
         //this.markerButton.setStyleProperty("top", "15rem");
         //this.markerButton.setStyleProperty("left", "2rem");
         //this.markerButton.setStyleProperty("border", "1px solid rgb(white)");
         //this.markerButton.setStyleProperty("borderRadius", "0.2rem");
         //this.markerButton.setStyleProperty("padding", "0.1rem");
         this.markerButton.addToContainer(this.tableCellLeft);

         this.markerButton.setEventListener("mouseenter", this.showMarkTooltip);
         this.markerButton.setEventListener("mouseleave", this.hideMarkTooltip);

         this.wordDataField = new WordDetailsExam(this.tableCellLeft);
         this.wordDataField.reset();
         this.inputWordPanel = new InputWordExam(this.tableCellRight, this.onSubmitAnswer, this.continueWithNextQuestion);
         this.inputWordPanel.reset();

         this.okCancelButton = new StandardButton("Cancel", this.onOkCancelPressed);
         this.okCancelButton.setStyleProperty("marginTop", "3rem");
         this.okCancelButton.setStyleProperty("width", "7rem");
         this.okCancelButton.setStyleProperty("height", "3rem");
         this.okCancelButton.addToContainer(this.container);
    }

    addToContainer(){
        if(!this.container.parentNode)
        {
            this.parentContainer.appendChild(this.container);
        }
    }

    onMarkPressed(markState){     
        this.wordObject.marked = (markState === 0)?true:false;
        this.controler.onUpdateWord(this.wordObject);
    }

    showMarkTooltip(){
        var tooltipText = "Mark this word in database if you haven't learned it yet or by some other reason";
        var bRect = this.markerButton.button.getBoundingClientRect();
        var xCoord = bRect.left + bRect.width + 25;
        var yCoord = bRect.top - 10;
        var coords = {
            top: yCoord,
            left: xCoord
        }
        this.controler.openTooltip([tooltipText, coords]);
    }

    hideMarkTooltip(){
        this.controler.closeTooltip();
    }

    removeFromContainer(){
        if(this.container.parentNode)
        {
            this.parentContainer.removeChild(this.container);
        }
    }

    setIndexesArray(){
        var indexesArray = [];
        for(var i = 0; i < this.controler.getWordsCount(); i++){
            indexesArray.push(i);
        }
        return(indexesArray);
    }

    onSubmitAnswer(answerObject){
        var answerResultObject = {
            wordOrMeaningOK: true,
            categoriesResults: null,
            finalResult: false
        }

        if(this.settingsParams.guessWord){
            if(removeWhitespacesFromStartAndEnd(answerObject.wordMeaningAnswer.toLowerCase()) !== removeWhitespacesFromStartAndEnd(this.wordObject.word.toLowerCase())){
                answerResultObject.wordOrMeaningOK = false;
            }
        }  //if meaning(first) is being guessed
        else if(answerObject.wordMeaningAnswer !== this.wordObject.meanings[0]){
            answerResultObject.wordOrMeaningOK = false;
        }
           
        answerResultObject.categoriesResults = answerObject.categoryAnswers.map(this.checkForCategoryMatch);        
        
        this.setScore(this.checkResult(answerResultObject));
        this.inputWordPanel.proceedToContinueMode(answerResultObject);   
        this.wordDataField.showAllFields();
    }

    checkResult(answerResultObject){
        var result = answerResultObject.wordOrMeaningOK;
        for(var i = 0; i < answerResultObject.categoriesResults.length; i++){
            result = (result && answerResultObject.categoriesResults[i]);
        }

        return result;
    }

    checkForCategoryMatch(category){     
        for(var i = 0; i < this.wordObject.categories.length; i++){
            if(category.category === this.wordObject.categories[i].category){
                if(category.value === this.wordObject.categories[i].value){
                    return true;
                }             
            }
        }
        return false;
    }

    continueWithNextQuestion(){
        this.infoTable.setField(CURRENT_ANSWER, "waiting for answer...");
        this.infoTable.setFieldFontSize(CURRENT_ANSWER, "1.2rem");
        this.infoTable.setFieldFontColor(CURRENT_ANSWER, "rgb(52, 163, 255)");
        this.infoTable.setFieldBkgColor(CURRENT_ANSWER, "");
        this.infoTable.showField(CURRENT_ANSWER, false, true);
        if(this.currentWord < this.settingsParams.numQuestions){
            this.drawNewWord();
        }
        else{
            this.endExam();
        }      
    }

    drawNewWord(){
        if(this.examState === EXAM_STATES.END_EXAM){
            return;
        }  
        if(this.indexesArray.length <= 0){
            this.endExam();
            return;
        }   
        
        var indexesIndex = Math.floor(Math.random()*this.indexesArray.length);
        var wordIndex = this.indexesArray[indexesIndex];
        this.indexesArray.splice(indexesIndex, 1);
        this.wordObject = this.controler.getWordByIndex(wordIndex);
        this.wordDataField.open(this.wordObject);
        this.inputWordPanel.open(this.wordObject);

        this.currentWord++;

        this.infoTable.setField(QUESTION_NUMBER, this.currentWord  + "/" + (this.settingsParams.numQuestions));

        var markerState = (this.wordObject.marked)?1:0;
        this.markerButton.setState(markerState);

        this.examState = EXAM_STATES.WAITING_ANSWER;   
    }

    endExam(){
        this.examState = EXAM_STATES.END_EXAM;

        this.examTimer.stop();

        this.infoTable.setField(CURRENT_ANSWER, "Exam over, press OK to exit.");
        this.infoTable.setFieldFontColor(CURRENT_ANSWER, "white");
        this.infoTable.setFieldFontSize(CURRENT_ANSWER, "1.5rem");
        this.infoTable.setFieldBkgColor(CURRENT_ANSWER, "rgb(52, 124, 255)");
        this.inputWordPanel.setButtonMode(false);

        this.okCancelButton.setLabel("Ok");
        this.okCancelButton.changeHandler(this.onExitExam)
    }

    onExitExam(){
        this.onExitExamHandler();
    }

    setScore(isAnswerTrue){
        var answerLabel = "NOT SET";
        if(isAnswerTrue){
            this.score++;
            this.wordsGuessed++;
            answerLabel = "TRUE!";
        }
        else{
            this.score--;
            this.wordsWrong++;
            answerLabel = "WRONG!";
        }

        this.infoTable.setField(QUESTION_NUMBER, this.currentWord + "/" + (this.settingsParams.numQuestions));
        this.infoTable.setField(SCORE, this.score);
        this.infoTable.setField(WORDS_GUESSED, this.wordsGuessed);
        this.infoTable.setField(WORDS_WRONG, this.wordsWrong);
        this.infoTable.setFieldFontSize(CURRENT_ANSWER, "1.5rem");
        let fontColor = "green";
        if(!isAnswerTrue){
            fontColor = "red";
        }
        this.infoTable.setFieldFontColor(CURRENT_ANSWER, "white");
        this.infoTable.setFieldBkgColor(CURRENT_ANSWER, fontColor);
        this.infoTable.setField(CURRENT_ANSWER, answerLabel);
        this.infoTable.showField(CURRENT_ANSWER, false, true);
    }
   
    setWord(wordObject){
        this.wordObject = wordObject;
        this.wordDataField.open(wordObject);
        this.inputWordPanel.open(wordObject);
    }

    onOkCancelPressed(e){
            this.controler.openMessageBoxYesNo("Cancel exam?", this.onExitExam, null)
    }

    open(settingsParams){
        this.reset();
        this.settingsParams = settingsParams;
        this.wordDataField.setSettings(settingsParams);
        this.inputWordPanel.setSettings(settingsParams);
        this.okCancelButton.setLabel("Cancel");
        this.okCancelButton.changeHandler(this.onOkCancelPressed);
        this.infoTable.setFieldFontSize(CURRENT_ANSWER, "1.2rem");
        this.infoTable.setFieldBkgColor(CURRENT_ANSWER, "");
        this.infoTable.setFieldFontColor(CURRENT_ANSWER, "rgb(52, 163, 255)");
        this.infoTable.setField(CURRENT_ANSWER, "waiting for answer...");
        this.infoTable.hideField(CURRENT_ANSWER, true, false);
        this.addToContainer();

        this.examState = EXAM_STATES.WAITING_ANSWER;

        this.drawNewWord();

        this.examTimer.start();
    }

    reset(){
        this.settingsParams = null;
        this.currentWord = 0;
        this.wordsGuessed = 0;
        this.wordsWrong = 0;
        this.score = 0;
        this.indexesArray = this.setIndexesArray();
        this.wordDataField.reset();
        this.inputWordPanel.reset();
        this.infoTable.reset();
        this.examTimer.reset();
    }

    close(){
        this.removeFromContainer();
    }

    clear(){
        this.okCancelButton.clear();
        this.wordDataField.clear();
        this.markerButton.clear();
        this.inputWordPanel.clear();
        this.examTimer.clear();
        this.removeFromContainer();
    }
}