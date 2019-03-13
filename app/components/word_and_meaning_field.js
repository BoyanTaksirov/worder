const WordDetails = require("./word_details");
const MeaningsDetails = require("./meanings_details");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class WordAndMeaningField{
    constructor(wordObject, wordDBIndex, classNameContainer, classNameLabels, pContainer, enterExitHandler, settingsParams, updateWord, controler){
         this.classNameContainer = classNameContainer;
         this.classNameLabels = classNameLabels;
         this.parentContainer = pContainer;

         this.wordObject = wordObject;
         this.updateWord = updateWord;
         this.enterExitHandler = enterExitHandler;
         this.controler = controler;

         this.onRowEnter =  this.onRowEnter.bind(this);
         this.onRowOut =  this.onRowOut.bind(this);
         this.clearBkgColor = this.clearBkgColor.bind(this);
         this.markUnmarkWord = this.markUnmarkWord.bind(this);
         this.showMarkTooltip = this.showMarkTooltip.bind(this);
         this.hideMarkTooltip = this.hideMarkTooltip.bind(this);
         this.updateVisualMarks = this.updateVisualMarks.bind(this);

         this.container = document.createElement("div");
         this.container.className = this.classNameContainer;
         this.container.addEventListener("mouseenter", this.onRowEnter);
         this.container.addEventListener("mouseout", this.onRowOut);

         this.settingsObject = settingsParams;

         this.tableContainer = document.createElement("table");
         this.tableContainer.className = CLASS_NAMES.TableClassName;
         this.tableRow = document.createElement("tr");
         this.tableContainer.appendChild(this.tableRow);

         this.tableCellNumber = document.createElement("th");
         this.tableCellNumber.style.width = "7%";
         this.tableCellNumber.innerHTML = wordDBIndex + 1;
         this.tableCellNumber.className = CLASS_NAMES.WordNumberClass;
         this.tableCellNumber.style.verticalAlign = "middle";
         this.tableRow.appendChild(this.tableCellNumber);

         this.marker = document.createElement("th");
         this.marker.style.width = "3%";
         this.marker.innerHTML = "!";
         this.marker.className = (this.wordObject.marked)? CLASS_NAMES.WordMarkerActive:CLASS_NAMES.WordMarker;
         this.marker.style.verticalAlign = "middle";
         this.tableRow.appendChild(this.marker);
         this.marker.addEventListener("mousedown", this.markUnmarkWord);
         this.marker.addEventListener("mouseenter", this.showMarkTooltip);
         this.marker.addEventListener("mouseleave", this.hideMarkTooltip);

         this.tableCellLeft = document.createElement("th");
         this.tableCellLeft.className = CLASS_NAMES.TableCellLeftClass;
         this.tableCellLeft.style.width = "50%";
         this.tableCellLeft.style.verticalAlign = "top";
         this.tableCellLeft.style.borderRight = "1px rgb(110, 110, 110) solid";
         this.tableRow.appendChild(this.tableCellLeft);
         this.tableCellRight = document.createElement("th");
         this.tableCellRight.className = CLASS_NAMES.TableCellRightClass;
         this.tableCellRight.style.verticalAlign = "top";
         this.tableCellRight.style.width = "40%";
         this.tableRow.appendChild(this.tableCellRight);
         this.container.appendChild(this.tableContainer);

         this.wordField = new WordDetails(this.tableCellLeft, wordObject, this.settingsObject);
         this.meaningsField = new MeaningsDetails(this.tableCellRight, wordObject.meanings);

         this.wordId = wordObject.wordId;
         this.wordDBIndex = wordDBIndex;
         this.setWordText(wordObject.word);
    }

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

    setWordText(wordText){
       this.wordText = wordText; 
       this.wordField.innerText = this.wordText;
    }

    showMeaningFields(){
        this.meaningsField.showMeaningFields(true);
    }

    hideMeaningFields(){
        this.meaningsField.hideMeaningFields(true);
    }

    showWordFields(){
        this.wordField.showWordFields(true);
    }

    hideWordFields(){
        this.wordField.hideWordFields(true);
    }

    markUnmarkWord(e){
        this.wordObject.marked =  !this.wordObject.marked;
        this.marker.className = (this.wordObject.marked)? CLASS_NAMES.WordMarkerActive:CLASS_NAMES.WordMarker;
        this.updateWord(this.wordObject, false);
    }

    updateVisualMarks(){
        this.marker.className = (this.wordObject.marked)? CLASS_NAMES.WordMarkerActive:CLASS_NAMES.WordMarker;
    }


    showMarkTooltip(e){
        var bRect = e.currentTarget.getBoundingClientRect();
        var xCoord = bRect.left + bRect.width + 25;
        var yCoord = bRect.top;
        var coords = {
            top: yCoord,
            left: xCoord
        }
        var message = "Mark this word, if you think it is not yet learned or for some other reason";

        this.controler.openTooltip([message, coords]);
    }

    hideMarkTooltip(e){
        this.controler.closeTooltip();
    }

     onRowEnter(e){
        if(e.target != this.container)
        {
            return;
        }

        this.topPos = this.container.getBoundingClientRect().top;
        this.enterExitHandler(true, this.topPos, this.wordDBIndex, this.wordObject);

        //this.tableCellNumber.style.backgroundColor = "rgb(40, 125,253)";
        this.tableCellNumber.style.backgroundColor = "rgb(0, 140, 255)";
     }

     onRowOut(e){
        let bRect = this.container.getBoundingClientRect();
        if(e.clientY > bRect.top && e.clientY < bRect.bottom && e.clientX > bRect.left && e.clientX < bRect.right)
        {
            return;
        }
    
        this.clearBkgColor();

        //this.enterExitHandler(false, this.topPos, this.wordDBIndex);
     }

     clearBkgColor(){
        this.container.style.backgroundColor = "";
        this.tableCellNumber.style.backgroundColor = "";
     }

    clear(){
        this.removeFromContainer();
        this.marker.removeEventListener("mousedown", this.markUnmarkWord);
        this.marker.removeEventListener("mouseenter", this.showMarkTooltip);
        this.marker.removeEventListener("mouseleave", this.hideMarkTooltip);
        this.container = null;
        this.cLabel = null;
        this.cInput = null;
    }
}