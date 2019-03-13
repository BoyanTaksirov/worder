module.exports = class InputAndLabelHorizontal{
    constructor(classNameContainer, classNameLabel, classNameInput, pContainer, labelText = "", category = ""){
         this.classNameContainer = classNameContainer;
         this.classNameLabel = classNameLabel;
         this.classNameInput = classNameInput;
         this.parentContainer = pContainer;
         this.category = category;

         this.onEventInitiated = this.onEventInitiated.bind(this);
      
         this.container = document.createElement("div");
         this.container.className = this.classNameContainer;
         this.container.style.textAlign = "left";

         this.cLabel = document.createElement("label");
         this.cLabel.className =  this.classNameLabel;
         this.cLabel.style.display = "inline-block";
         this.cLabel.style.marginRight = "1rem";
         this.cLabel.innerText = labelText;
         this.container.appendChild(this.cLabel);

         this.cInput = document.createElement("input");
         this.cInput.type = "text";
         this.cInput.className =  this.classNameInput;
         this.cInput.style.display = "inline-block";
         this.cInput.style.width = "30%";
         this.container.appendChild(this.cInput);

         this.events = [];
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

    setWidth(value){
        this.container.style.width = value;
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

    setStyleProperty(property, value){
        this.container.style[property] = value;
    }

    setValueAlign(value){
        this.cLabel.style.textAlign = value;
    }

    setLabelFontSize(value){
        this.cLabel.style.fontSize = value;
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

    setEventListener(type, callback){
            this.handlers[type] = callback;
            this.cInput.addEventListener(type, this.onEventInitiated);
            this.events.push(type);
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
        this.container = null;
        this.cLabel = null;
        this.cInput = null;
    }
}