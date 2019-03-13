const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const MessageBoxBase = require("./message_box_base");

module.exports = class MessageBoxYesNo extends MessageBoxBase{
    constructor(container){
        super(container);

        this.onYesButtonClick = this.onYesButtonClick.bind(this);
        this.onNoButtonClick = this.onNoButtonClick.bind(this);
     
        this.yesButton = document.createElement("button");
        this.yesButton.addEventListener("mousedown", this.onYesButtonClick);    
        this.yesButton.innerText = "Yes";
        this.yesButton.className = CLASS_NAMES.WordInputButtonsClassName;
        this.container.appendChild(this.yesButton);    
        
        this.noButton = document.createElement("button");
        this.noButton.addEventListener("mousedown", this.onNoButtonClick);    
        this.noButton.innerText = "No";
        this.noButton.className = CLASS_NAMES.WordInputButtonsClassName;
        this.container.appendChild(this.noButton);    
        
        this.yesHandler;
        this.noHandler;
    }

    onYesButtonClick(e){
        if(this.yesHandler){
            if(this.yesHandlerParams){
                if(Array.isArray(this.yesHandlerParams)){
                    this.yesHandler(...this.yesHandlerParams);
                }
                else{
                    this.yesHandler(this.yesHandlerParams);
                }                  
            }
            else{
                this.yesHandler();
            }
        }
    }

    onNoButtonClick(e){
        if(this.noHandler){
            if(this.noHandlerParams){
                this.noHandler(...this.noHandlerParams);
            }
            else{
                this.noHandler();
            }
        }
    }

    open(message, yesHandler = null,  noHandler = null, yesHandlerParams = null, noHandlerParams = null){
        super.open(message);     

        this.yesHandler = yesHandler; 
        this.noHandler = noHandler;
        this.yesHandlerParams = yesHandlerParams;
        this.noHandlerParams = noHandlerParams;
    }
}