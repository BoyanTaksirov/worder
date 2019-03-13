const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class MessageBoxBase{
    constructor(container){

        this.parentContainer = container;

        this.screenBkg = document.createElement("div");
        this.screenBkg.className = CLASS_NAMES.GlobalTransparentBkg;

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.MessageBoxClassName;

        this.screenBkg.appendChild(this.container);

        this.messageHolder = document.createElement("div");
        this.messageHolder.className = CLASS_NAMES.MessageHolderClassName;
        this.container.appendChild(this.messageHolder);

        this.positionDialog = this.positionDialog.bind(this);

        this.OPENED = false;
    }

    clear(){  
        this.controler.closeAllDialogs();
        if(this.container.parentNode)   
        {
            this.parentContainer.removeChild(this.container);
        }
    }

    positionDialog(e){
        var dWidth = this.container.clientWidth;
        var dHeight = this.container.clientHeight;

        var left = (window.innerWidth - dWidth)/2;
        var top = (window.innerHeight - dHeight)/2;

        this.container.style.top = top + "px";
        this.container.style.left = left + "px";
    }

    addToContainer(){
        if(!this.screenBkg.parentNode)
        {
            this.parentContainer.appendChild(this.screenBkg);
            this.OPENED = true;
        }
    }

    removeFromContainer(){
        if(this.screenBkg.parentNode)
        {
            this.parentContainer.removeChild(this.screenBkg);
            this.OPENED = false;
        }            
    }

    open(message){
        window.removeEventListener("resize", this.positionDialog);
        window.addEventListener("resize", this.positionDialog);

        this.messageHolder.innerText = message;

        this.addToContainer();
        this.positionDialog(null);
    }

    close(){
        window.removeEventListener("resize", this.positionDialog);
        this.messageHolder.innerText = "";
        this.removeFromContainer();
    }
}