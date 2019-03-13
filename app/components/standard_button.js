const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class StandardButton{
    constructor(labelText, handler, buttonClass = CLASS_NAMES.CustomButtonClassName, id = null, activeClass = null, 
        customData = null, onMouseEnterHandler = null, onMouseLeaveHandler = null, tooltipMessage = null){
        this.button = document.createElement("button");
        this.buttonPressedHandler = handler;
        this.button.className = buttonClass;
        this.baseClass = buttonClass;
        this.activeClass = activeClass;
        this.button.id = id;
        this.customData = customData;
        this.onMouseEnterHandler = onMouseEnterHandler;
        this.onMouseLeaveHandler = onMouseLeaveHandler;
        this.tooltipMessage = tooltipMessage;
       
        this.onButtonPressed = this.onButtonPressed.bind(this); 
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.button.addEventListener("mousedown", this.onButtonPressed);

        if(this.onMouseEnterHandler){
            this.button.addEventListener("mouseenter", this.onMouseEnter);
        }

        if(this.onMouseLeaveHandler){
            this.button.addEventListener("mouseleave", this.onMouseLeave);
        }
      
        this.button.innerText = labelText;

        this.parentContainer;
        this.buttonColor = null;
    }

    setButtonInactive(){
        this.button.style.backgroundColor = "rgb(76, 76, 76)";
        this.button.style.borderColor = "rgb(139, 139, 139)";
        this.button.disabled = true;
    }

    setButtonColor(color){
        this.buttonColor = color;
        this.button.style.backgroundColor = this.buttonColor;
    }
    
    setButtonActive(){
        this.button.style.backgroundColor = this.buttonColor;
        this.button.style.borderColor = null;
        this.button.disabled = false;
    }

    onButtonPressed(e){
        this.buttonPressedHandler(this.getButtonId(), this);
    }

    getButtonId(){
        return this.button.id;
    }

    getContainer(){
        return(this.button);
    }

    changeHandler(newHandler){
        this.buttonPressedHandler = newHandler;
    }

    setLabel(newLabel){
        this.button.innerText = newLabel;
    }

    setClass(newClass){
        this.button.className = newClass;
    }

    setStyleProperty(property, value){
        this.button.style[property] = value;
    }

    show(){
        this.button.style.display = "inline-block";
    }

    hide(){
        this.button.style.display = "none";
    }

    onMouseEnter(e){       
        this.onMouseEnterHandler(this);
    }

    onMouseLeave(e){
        this.onMouseLeaveHandler();
    }

    addToContainer(pContainer){
        this.removeFromContainer();
        this.parentContainer = pContainer;
        this.parentContainer.appendChild(this.button);
    }

    removeFromContainer(){
        if(this.parentContainer && this.button.parentNode){
            this.parentContainer.removeChild(this.button);   
        }
    }

    removeHandlers(){
        this.button.removeEventListener("mousedown", this.onButtonPressed);
    }

    clear(){
        this.removeHandlers();
        this.removeFromContainer();
    }
}