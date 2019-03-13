module.exports = class InputAndLabel{
    constructor(classNameContainer, classNameLabel, classNameInput, pContainer, labelText = "", fieldText = ""){
         this.classNameContainer = classNameContainer;
         this.classNameLabel = classNameLabel;
         this.classNameInput = classNameInput;
         this.parentContainer = pContainer;

         this.onEventInitiated = this.onEventInitiated.bind(this);

         this.events = [];

         this.container = document.createElement("div");
         this.container.className = this.classNameContainer;

         this.cLabel = document.createElement("label");
         this.cLabel.className =  this.classNameLabel;
         this.cLabel.innerText = labelText;
         this.container.appendChild(this.cLabel);

         this.cInput = document.createElement("input");
         this.cInput.type = "text";
         this.cInput.className =  this.classNameInput;
         this.cInput.style.width = "100%";
         this.cInput.value = fieldText;
         this.container.appendChild(this.cInput);

         this.handlers = {};

         this.customData;
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

    setIfEditable(editable){
        this.cInput.readOnly = !editable;
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

    setLabelFontColor(value){
        this.cLabel.style.color = value;
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
        this.handlers[e.type](e);
    }

    clearHandlers(){ 
        for(var event in this.handlers){
            this.cInput.removeEventListener(event, this.onEventInitiated);
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

    clear(){
        this.clearHandlers();
        this.removeFromContainer();
    }
}