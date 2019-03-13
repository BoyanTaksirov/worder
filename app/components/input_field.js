const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class InputField{
    constructor(pContainer, fieldText = "",  classNameInput = CLASS_NAMES.InputFieldClassName){
        
         this.classNameInput = classNameInput;
         this.parentContainer = pContainer;

         this.onEventInitiated = this.onEventInitiated.bind(this);

         this.events = [];

         this.cInput = document.createElement("input");
         this.cInput.type = "text";
         this.cInput.className =  this.classNameInput;
         this.cInput.style.width = "100%";
         this.cInput.value = fieldText;
         this.parentContainer.appendChild(this.cInput);

         this.handlers = {};

         this.customData;
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

    setText(text){
        if(this.cInput)
        {
            this.cInput.value = text;
        }
    }

    setIfEditable(editable){
        this.cInput.readOnly = !editable;
    }

    setStyleProperty(property, value){
        this.cInput.style[property] = value;
    }

    setInputFieldFontSize(value){
        this.cInput.style.fontSize = value;
    }

    setInputFieldColor(value){
        this.cInput.style.color = value;
    }

    setBackgroundColor(value){
        this.cInput.style.backgroundColor = value;
    }

    setBorderColor(value){
        this.cInput.style.borderColor = value;
    }

    setEventListener(type, callback){
            this.handlers[type] = callback;
            this.cInput.addEventListener(type, this.onEventInitiated);
            this.events.push(type);
    }

    setCustomData(customData){
        this.customData = customData;
    }

    onEventInitiated(e){
        this.handlers[e.type]();
    }

    clearHandlers(){ 
        for(var event in this.handlers){
            this.cInput.removeEventListener(event, this.onEventInitiated);
        }    
    }

    show(){
        this.cInput.style.visibility = "visible";
    }

    hide(){
        this.cInput.style.visibility = "hidden";
    }

    addToContainer(insertBeforeElement = null){
        if(!insertBeforeElement){
            this.parentContainer.appendChild(this.cInput);
        }
        else{
            this.parentContainer.insertBefore(this.cInput, insertBeforeElement);
        }
    }

    removeFromContainer(){
        if(this.container && this.cInput.parentNode)
        {
            this.parentContainer.removeChild(this.cInput);
        }
    }

    clear(){
        this.clearHandlers();
        this.removeFromContainer();
        this.cInput = null;
    }
}