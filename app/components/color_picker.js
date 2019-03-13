const AColorPicker = require('a-color-picker');

const StandardButton = require("./standard_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class ColorPicker{
    constructor(pContainer, colorChangeHandler){
        this.parentContainer = pContainer;

        this.container = document.createElement("div");
        //this.container.className = CLASS_NAMES.FlexibleStandardContainer;
        this.container.style.border = "none";
        //this.container.style.backgroundColor = "rgb(21,26,36)";
        this.container.style.width = "15rem";
        this.container.style.margin = "0.5rem auto";
        this.container.style.padding = "0.5rem";
        this.parentContainer.appendChild(this.container);

        this.colorChangeHandler = colorChangeHandler;

        this.onButtonClick = this.onButtonClick.bind(this);
        this.setColor = this.setColor.bind(this);

        this.colorPickerButton = new StandardButton("open color", this.onButtonClick, CLASS_NAMES.CustomButtonClassName, "colorPickerID");
        this.colorPickerButton.setStyleProperty("marginBottom", "0.5rem");
        this.colorPickerButton.addToContainer(this.container);

        this.colorPickerContainer = document.createElement("div");
        this.colorPickerContainer.style.display = "none";
        this.colorPickerContainer.style.zIndex = 1000;
        this.container.appendChild(this.colorPickerContainer);

        this.currentColor = "rgb(0,0,0)";

        this.colorPicker = AColorPicker.createPicker(this.colorPickerContainer, {showHSL:false, showRGB:false, showHEX:false, showAlpha:false});
        this.colorPicker.color = this.currentColor;
        this.colorPicker.on("change", this.setColor);  
        
        this.addToContainer();
    }


    onButtonClick(){
        if(this.colorPickerContainer.style.display === "none"){
            this.colorPickerContainer.style.display = "block";
            this.colorPickerButton.setLabel("close color");
            this.colorPicker.color = "rgb(0,0,0)";
        }
        else {
            this.colorPickerContainer.style.display = "none";
            this.colorPickerButton.setLabel("open color");
        }
        this.colorChangeHandler(null, true);
    }

    setColor(picker, color){
        this.colorChangeHandler(color);
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
}