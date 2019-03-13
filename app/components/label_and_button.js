const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class LabelAndButton{
    constructor(pContainer, labelText, buttonName, labelHandler, buttonHandler){
        this.parentContainer = pContainer;
        this.labelText = labelText;
        this.buttonName = buttonName;

        this.labelHandler = labelHandler;
        this.buttonHandler = buttonHandler;

        this.onLabelClick = this.onLabelClick.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);

        this.container;
        this.cInput;
        this.button;

        this.create();

        this.addToContainer();
    }

    create(){
        this.container = document.createElement("div");
        this.container.style.display = "flex";
        this.container.style.flexDirection = "row";

         this.cInput = document.createElement("input");
         this.cInput.type = "text";
         this.cInput.readOnly = true;
         this.cInput.value = this.labelText;
         this.cInput.className =  CLASS_NAMES.DropdownMenuClassName;
         this.cInput.style.width = "75%";
         this.cInput.style.order = 1;
         this.cInput.addEventListener("mousedown", this.onLabelClick);
         this.container.appendChild(this.cInput);

        this.button = document.createElement("button");
        this.button.className = CLASS_NAMES.CustomButtonClassName;
        this.button.style.order = 2;
        this.button.style.width = "22%"      
        this.button.innerText = this.buttonName;
        this.button.addEventListener("mousedown", this.onButtonClick);
       
        this.container.appendChild(this.button);

     
    }

    onLabelClick(e){
        this.labelHandler(this.cInput.value);
    }

    onButtonClick(e){
        this.buttonHandler(this.cInput.value);
    }

    addToContainer(){
        if(!this.container.parentNode)   
        {
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer(){
        if(this.container.parentNode)   
        {
            this.parentContainer.removeChild(this.container);   
        }
    }

    clear(){
        this.button.removeEventListener("mousedown", this.onButtonClick);
        this.cInput.removeEventListener("mousedown", this.onLabelClick);

        this.removeFromContainer();
    }
}