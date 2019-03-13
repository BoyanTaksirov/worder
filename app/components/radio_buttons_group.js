const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class RadioButtonsGroup{
    constructor(pContainer, buttonsData, checkHandler){
        this.parentContainer = pContainer;

        this.checkHandler = checkHandler;

        this.realRadioButtons = [];

        this.radioButtonClicked = this.radioButtonClicked.bind(this);

        this.radioButtonsContainer = document.createElement("div");
        this.radioButtonsContainer.className = CLASS_NAMES.RadioButtonsContainer;

        for(var i = 0; i < buttonsData.length; i++){
            var singleButtonContainer = document.createElement("label");
            singleButtonContainer.className = CLASS_NAMES.RadioButtonsButtonContainer;
            this.radioButtonsContainer.appendChild(singleButtonContainer);

            var radioButtonFaux = document.createElement("span");
            radioButtonFaux.innerText = buttonsData[i].buttonName;
    
            var realRadioButton = document.createElement("input");
            realRadioButton.type = "radio";
            realRadioButton.id = buttonsData[i].buttonId;
            realRadioButton.name = buttonsData[i].groupName;
            realRadioButton.className = CLASS_NAMES.RadioButtonReal;
            realRadioButton.checked = buttonsData[i].checked;
            realRadioButton.addEventListener("change", this.radioButtonClicked);
    
            singleButtonContainer.appendChild(realRadioButton);
            singleButtonContainer.appendChild(radioButtonFaux);

            this.realRadioButtons.push(realRadioButton);

            this.radioButtonsContainer.appendChild(singleButtonContainer);
        }
    }

    clearRadioButtons(){
        for(var i = 0; i < this.realRadioButtons.length; i++){
            this.realRadioButtons[i].removeEventListener("change", this.radioButtonClicked);
        }
    }

    radioButtonClicked(e){
        if(e.currentTarget.checked){
            if(this.checkHandler){
                this.checkHandler(e.currentTarget.id);
            }          
        }
    }

    getSelectedRadioButtonId(){
        for(var i = 0; i < this.realRadioButtons.length; i++){
            if(this.realRadioButtons[i].checked){
                return(this.realRadioButtons[i].id);
            }
        }
    }

    addToContainer(element = null){    
            if(!this.radioButtonsContainer.parentNode)
            {
                if(!element){     
                    this.parentContainer.appendChild(this.radioButtonsContainer);
                    this.OPENED = true;
                }
                else{
                    this.parentContainer.insertBefore(this.radioButtonsContainer, element);
                    this.OPENED = true;
                }
            }
    }

    removeFromContainer(){
        if(this.radioButtonsContainer.parentNode)
        {
            this.parentContainer.removeChild(this.radioButtonsContainer);
            this.OPENED = false;
        }
    }

    clear(){
        this.clearRadioButtons();
        this.removeFromContainer();
    }
}