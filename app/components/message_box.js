const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const MessageBoxBase = require("./message_box_base");

module.exports = class MessageBox extends MessageBoxBase{
    constructor(container){
        super(container);

        this.onOkButtonClick = this.onOkButtonClick.bind(this);
     
        this.okButton = document.createElement("button");
        this.okButton.addEventListener("mousedown", this.onOkButtonClick);    
        this.okButton.innerText = "Ok";
        this.okButton.className = CLASS_NAMES.WordInputButtonsClassName;
        this.container.appendChild(this.okButton);     
        
        this.okHandler;
    }

    onOkButtonClick(e){
        if(this.okHandler){
            this.okHandler();
        }
    }

    open(message, okHandler = null){
        super.open(message);     

        this.okHandler = okHandler;
    }
}