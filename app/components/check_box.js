const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class CheckBox{
    constructor(pContainer, labelText, onChangeHandler = null, id = null){
        this.parentContainer = pContainer;

        this.onChangeHandler = onChangeHandler;
        this.checkId = id;

        this.onChange = this.onChange.bind(this);

        this.container = document.createElement("label");
        this.container.className = CLASS_NAMES.CheckBoxContainer;
        this.container.innerText = labelText;

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.addEventListener("change", this.onChange);
        this.container.appendChild(this.checkbox);

        this.checkboxFaux = document.createElement("span");
        this.checkboxFaux.className = CLASS_NAMES.CheckboxFaux;
        this.container.appendChild(this.checkboxFaux);
    }

    getStatus(){
        return(this.checkbox.checked === true);
    }

    setCheck(isChecked){
        this.checkbox.checked = isChecked;
    }

    onChange(){
        if(this.onChangeHandler){
            this.onChangeHandler(this.checkId, this.getStatus());
        }
    }

    addToContainer(){
        if(!this.container.parentNode){       
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer(){
        if(this.container.parentNode){
            this.parentContainer.removeChild(this.container);
        }            
    }

    clear(){
        this.checkbox.removeEventListener("change", this.onChange);
        this.removeFromContainer();
    }
}