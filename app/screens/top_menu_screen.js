const BaseScreen = require("./base_screen");
const MAIN_MENU_SCREEN_TYPE = require("../globalData/globals").MAIN_MENU_SCREEN_TYPE;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const MM_BUTTON_DATA = require("../globalData/globals").MM_BUTTON_DATA;
const StandardButton = require("../components/standard_button");

module.exports = class TopMenuScreen extends BaseScreen {
    constructor(pContainer, fSwitch, controler, fMAdditional = null) {
        super(pContainer, MAIN_MENU_SCREEN_TYPE);
        this.switchFunction = fSwitch;
        this.additionalMenuFunctionality = fMAdditional;
        this.controler = controler;

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.activeButtonId;
        this.menuButtons = [];
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);

        this.create();
    }

    create() {
        this.container = document.createElement("div");      
        this.container.className = CLASS_NAMES.MainMenuBkgClassName;
        this.parentContainer.appendChild(this.container);

        this.secondaryButtonsContainer = document.createElement("div");
        this.secondaryButtonsContainer.className = CLASS_NAMES.SecondaryButtonsContainerClass;

        this.createButtons();
    }

    createButtons(){

        for(var buttonData in MM_BUTTON_DATA){
                if(MM_BUTTON_DATA.hasOwnProperty(buttonData)){ 
                    if(MM_BUTTON_DATA[buttonData].type !== "INTERVAL"){                         
                    var tempButton = new StandardButton(MM_BUTTON_DATA[buttonData].text,  this.onMenuButtonClick, 
                        MM_BUTTON_DATA[buttonData].class, MM_BUTTON_DATA[buttonData].id, MM_BUTTON_DATA[buttonData].activeClass, 
                        MM_BUTTON_DATA[buttonData].type, this.onMouseEnter, this.onMouseLeave, MM_BUTTON_DATA[buttonData].tooltip);

                    if(MM_BUTTON_DATA[buttonData].type === "STATE"){
                        tempButton.addToContainer(this.container);
                    }  
                    else{
                        tempButton.addToContainer(this.secondaryButtonsContainer);
                    }         
                  
                    this.menuButtons.push(tempButton);
                }
                else{
                    var interval = document.createElement("div");
                    interval.style.width = "3rem";
                    this.container.appendChild(interval);
                }
            }
        }

        this.container.appendChild(this.secondaryButtonsContainer);
    }

    onMenuButtonClick(id, button){
        if(button.customData !== "STATE"){
            this.additionalMenuFunctionality(id);
            return;
        }
        if(id === this.activeButtonId){
            return;
        }
        this.switchFunction(id);
        this.activeButtonId = id;
        this.setActiveButton(id);
    }

    setActiveButton(buttonId){
        this.activeButtonId = buttonId;
        for(let i = 0; i < this.menuButtons.length; i++)
        {              
            if(buttonId !== this.menuButtons[i].getButtonId()){                   
                this.menuButtons[i].setClass(this.menuButtons[i].baseClass);
            } 
            else{
                this.menuButtons[i].setClass(this.menuButtons[i].activeClass);
            }                   
        }      
    }

    onMouseEnter(buttonInstance){
        var bRect = buttonInstance.button.getBoundingClientRect();
        var xCoord = bRect.left + bRect.width + 25;
        var yCoord = bRect.top + 10;
        if(buttonInstance.customData === "FUNC"){
            yCoord = bRect.top;
        }
        var coords = {
            top: yCoord,
            left: xCoord
        }
        var tooltipText = buttonInstance.tooltipMessage;
        this.controler.openTooltip([tooltipText, coords])
    }

    onMouseLeave(){
        this.controler.closeTooltip();
    }

    activateButtons(){
        for(let btn of this.menuButtons){
            btn.setButtonActive();
            if(btn.getButtonId() === this.activeButtonId){
                btn.setClass(CLASS_NAMES.MainMenuButtonsActiveClassName);
            }
        }
    }

    deactivateButtons(){
        for(let btn of this.menuButtons){
            btn.setButtonInactive();
            if(btn.getButtonId() === this.activeButtonId){
                btn.setClass(CLASS_NAMES.MainMenuButtonsActiveClassName);
            }
        }
    }

    getHeight(){
        if(this.container)
        {
            return this.container.clientHeight;
        }
        else
        {
            return 0;
        }
    }

    clear(){
        for(let btn of this.menuButtons)
        {
           btn.removeEventListener("mousedown", this.onMenuButtonClick);
           this.container.removeChild(btn);
        }
        
        this.parentContainer.removeChild(this.container);
    }

}



