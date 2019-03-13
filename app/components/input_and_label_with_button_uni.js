const shortid = require('shortid');

const StandardButton = require("./standard_button");

const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class InputAndLabelWithButtonUni{
    constructor(classNameContainer, classNameLabel, classNameInput, pContainer, labelText = "", category = "", 
    buttonHandler = null, buttonLabel = "NOT SET"){
         this.classNameContainer = classNameContainer;
         this.classNameLabel = classNameLabel;
         this.classNameInput = classNameInput;
         this.parentContainer = pContainer;
         this.category = category;

         this.buttonHandler = buttonHandler;
         this.onButtonClicked = this.onButtonClicked.bind(this);
         this.fieldId = shortid.generate();

         this.onEventInitiated = this.onEventInitiated.bind(this);
         this.onKeyDown = this.onKeyDown.bind(this);

         this.events = [];

         this.container = document.createElement("div");
         this.container.className = this.classNameContainer;
         this.container.style.textAlign = "left";
         this.container.style.width = "100%";
         this.container.style.marginTop = "0.2rem";

         this.cLabel = document.createElement("label");
         this.cLabel.className =  this.classNameLabel;
         //this.cLabel.style.color = "rgb(34,34,34)";
         this.cLabel.innerText = labelText;
         this.container.appendChild(this.cLabel);

         this.inputAndButtonContainer = document.createElement("div");
         this.inputAndButtonContainer.style.display = "inline-flex";
         this.inputAndButtonContainer.style.flexDirection = "row";
         this.inputAndButtonContainer.style.width = "100%";
         this.container.appendChild(this.inputAndButtonContainer);

         this.cInput = document.createElement("input");
         this.cInput.type = "text";
         this.cInput.className =  this.classNameInput;
         this.cInput.style.order = 1;
         this.cInput.style.height = "2.2rem"; 
         this.cInput.addEventListener("keydown", this.onKeyDown);
         this.inputAndButtonContainer.appendChild(this.cInput);

         this.customButton = new StandardButton(buttonLabel, this.onButtonClicked, CLASS_NAMES.CustomButtonClassName);
         this.customButton.setStyleProperty("order", 2);
         this.customButton.setStyleProperty("height", "2.2rem");
         this.customButton.addToContainer(this.inputAndButtonContainer);

         this.setLabelWidthPercent(80);

         this.handlers = {};
    }

    getName(){
        return this.cLabel.innerText;
    }

    getText(){
        if(this.cInput)
        {
            return this.cInput.value;
        }
        else
        {
            return "";
        }
    }

    setName(text){
        this.cLabel.innerText = text;
    }

    setText(text){
        if(this.cInput)
        {
            this.cInput.value = text;
        }
    }

    setWidth(value){
        this.container.style.width = value;
    }

    setLabelWidthPercent(widthPercent){
        this.cInput.style.width = widthPercent + "%";
        var buttonWidthPercent = 100 - widthPercent;
        this.customButton.setStyleProperty("width", buttonWidthPercent + "%");

    }

    setBorderColor(color){
        this.cInput.style.borderColor = color;
    }

    setStyleProperty(property, value){
        this.container.style[property] = value;
    }

    setValueAlign(value){
        this.cLabel.style.textAlign = value;
    }

    setLabelFontSize(value){
        this.cLabel.style.fontSize = value;
    }

    setLabelFontColor(color){
        this.cLabel.style.color = color;
    }

    setInputFieldFontSize(value){
        this.cInput.style.fontSize = value;
    }

    setInputFieldColor(value){
        this.cInput.style.color = value;
    }

    setEventListener(type, callback){
            this.handlers[type] = callback;
            this.cInput.addEventListener(type, this.onEventInitiated);
            this.events.push(type);
    }

    onEventInitiated(e){
        this.handlers[e.type](e);
    }

    onButtonClicked(e){
        var params = {
            fieldId: this.fieldId,
            value: this.getText()
        }
        this.buttonHandler(params);
    }

    onKeyDown(e){
        if(e.keyCode === 13){
            this.onButtonClicked(null);
        }
    }

    show(){
        this.container.style.display = "block";
    }

    hide(){
        this.container.style.display = "none";
    }

    addToContainer(insertBeforeElement = null){
        if(!insertBeforeElement){
            this.parentContainer.appendChild(this.container);
        }
        else{
            this.parentContainer.insertBefore(this.container, insertBeforeElement);
        }
    }

    removeFromContainer(){
        if(this.container && this.container.parentNode)
        {
            this.parentContainer.removeChild(this.container);
        }
    }

    clearHandlers(){ 
        for(var event in this.handlers){
            this.cInput.removeEventListener(event, this.onEventInitiated);
        }

        this.cInput.removeEventListener("keydown", this.onKeyDown);
    }

    clear(){
        this.clearHandlers();
        this.customButton.clear();
        this.removeFromContainer();
        this.container = null;
        this.cLabel = null;
        this.cInput = null;
    }
}