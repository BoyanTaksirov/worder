const changeHandler = Symbol("changeHandler");
const setLabel = Symbol("setLabel");
const setClass = Symbol("setClass");

const ButtonState = require("../states/button_state");

const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class StateButton{
    constructor(stateArray, id = null){
        this.button = document.createElement("button");
        this.button.id = id;

        this.stateArray = stateArray;

        this.onButtonPressed = this.onButtonPressed.bind(this);  
        this.onEventInitiated = this.onEventInitiated.bind(this);
        this.button.addEventListener("mousedown", this.onButtonPressed);

        this.currentState = 0;
        this.initializeState(this.currentState);
      
        this.parentContainer;

        this.events = [];
        this.handlers = {};
    }

    //---------------------private---------------------------
    [setLabel](newLabel){
        this.button.innerText = newLabel;
    }

    [setClass](newClass){
        this.button.className = newClass;
    }

    [changeHandler](newHandler){
        this.buttonPressedHandler = newHandler;
    }
    //----------------------------------------------------------

    initializeState(stateNumber){
        this[setLabel](this.stateArray[stateNumber].buttonLabel);
        this[setClass](this.stateArray[stateNumber].buttonClass);
    }

    setState(stateNumber){
        this.currentState = stateNumber;
        this.initializeState(stateNumber);
    }

    setStyleProperty(property, value){
        this.button.style[property] = value;
    }

    setButtonInactive(){
        this.button.style.backgroundColor = "rgb(76, 76, 76)";
        this.button.style.borderColor = "rgb(139, 139, 139)";
        this.button.disabled = true;
    }
    
    setButtonActive(){
        this.button.style.backgroundColor = null;
        this.button.style.borderColor = null;
        this.button.disabled = false;
    }

    setEventListener(type, callback){
        this.handlers[type] = callback;
        this.button.addEventListener(type, this.onEventInitiated);
        this.events.push(type);
    }

    onEventInitiated(e){
        this.handlers[e.type]();
    }

    removeAdditionalHandlers(){ 
        for(var event in this.handlers){
            this.button.removeEventListener(event, this.onEventInitiated);
        }    
    }

    onButtonPressed(e){
        this.stateArray[this.currentState].stateHandler(this.currentState, this);
        this.currentState++;
        if(this.currentState >= this.stateArray.length){
            this.currentState = 0;
        }
        this.initializeState(this.currentState);
    }

    getButtonId(){
        return this.button.id;
    }

    getStateValue(){
        return this.stateArray[this.currentState].stateValue;
    }

    getContainer(){
        return(this.button);
    }

    show(){
        this.button.style.visibility = "visible";
    }

    hide(){
        this.button.style.visibility = "hidden";
    }

    addToContainer(pContainer){
        this.removeFromContainer();
        this.parentContainer = pContainer;
        this.parentContainer.appendChild(this.button);
    }

    removeFromContainer(){
        if(this.button.parentNode){
            this.parentContainer.removeChild(this.button);   
        }
    }

    removeHandlers(){
        this.button.removeEventListener("mousedown", this.onButtonPressed);
        this.removeAdditionalHandlers();
    }

    clear(){
        this.removeHandlers();       
        this.removeFromContainer();
    }
}