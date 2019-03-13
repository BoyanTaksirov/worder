const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class NameAndValue{
    constructor(pContainer, name, value){
         this.parentContainer = pContainer;

         this.container = document.createElement("div");

         this.nameLabel = document.createElement("div");
         this.nameLabel.className =  CLASS_NAMES.NameAndValueClassName;
         this.nameLabel.innerText = name;
         this.container.appendChild(this.nameLabel);

         this.valueLabel = document.createElement("div");
         this.valueLabel.className =  CLASS_NAMES.NameAndValueClassName;
         this.valueLabel.innerText = value;
         this.container.appendChild(this.valueLabel);

         this.addToContainer();
    }

    getName(){
        return this.nameLabel.innerText;
    }

    setName(text){
        this.nameLabel.innerText = text;
    }

    getValue(){       
        return this.valueLabel.innerText;
    }

    setValue(value){     
        this.valueLabel.innerText = value;      
    } 

    setStyleProperty(property, value){
        this.container.style[property] = value;
    }

    setInnerStyleProperty(property, value){
        this.nameLabel.style[property] = value;
        this.valueLabel.style[property] = value;
    }

    setValueAlign(value){
        this.valueLabel.style.textAlign = value;
    }

    setNameAlign(value){
        this.nameLabel.style.textAlign = value;
    }

    setLabelFontSize(value){
        this.valueLabel.style.fontSize = value;
    }

    setInputFieldFontSize(value){
        this.valueLabel.style.fontSize = value;
    }

    setNameFieldColor(color){
        this.nameLabel.style.color = color;
    }

    setInputFieldColor(value){
        this.valueLabel.style.color = value;
    }  

    setNameFieldBkgColor(value){
        this.nameLabel.style.backgroundColor = value;
    }

    setInputFieldBkgColor(value){
        this.valueLabel.style.backgroundColor = value;
    }  

    show(){
        this.container.style.display = "block";
        this.nameLabel.style.display = "inline-block";
        this.valueLabel.style.display = "inline-block";
    }

    hide(){
        this.container.style.display = "none";
    }

    showNameLabel(){
        this.show();
        this.valueLabel.style.display = "none";
    }

    showValueLabel(){
        this.show();
        this.nameLabel.style.display = "none";
    }

    reset(){
        this.show();
    }

    addToContainer(){
        if(this.container && !this.container.parentNode)
        {      
            this.parentContainer.appendChild(this.container);  
        }    
    }

    removeFromContainer(){
        if(this.container && this.container.parentNode)
        {
            this.parentContainer.removeChild(this.container);
        }
    }

    clear(){
        this.removeFromContainer();
        this.container = null;
        this.nameLabel = null;
        this.valueLabel = null;
    }
}