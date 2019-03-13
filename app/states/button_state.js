module.exports = class ButtonState{
    constructor(buttonLabel, buttonClass, stateHandler, stateValue){
        this.buttonLabel = buttonLabel;
        this.buttonClass = buttonClass;
        this.stateHandler = stateHandler;
        this.stateValue = stateValue;
    }
}