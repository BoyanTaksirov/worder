const NameAndValue = require("./name_and_value");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class InfoTable{
    constructor(pContainer){
        this.parentContainer = pContainer;

        this.infoFields = [];

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.InfoSectionClass;        
    }

    setInfoFields(infoArray){
        this.clearInfoFields();

        for(var i = 0; i < infoArray.length; i++){
            var tempLabel = new NameAndValue(this.container, infoArray[i].name, infoArray[i].value);
            tempLabel.setStyleProperty("height", "1.5rem");
            tempLabel.setStyleProperty("margin", "0.2rem");
            tempLabel.setInnerStyleProperty("borderRadius", "0.2rem");
            this.infoFields.push(tempLabel);
        }

        this.addToContainer();
    }

    clearInfoFields(){
        for(var i = 0; i < this.infoFields.length; i++){
            this.infoFields[i].clear();
        }
        this.infoFields = [];
    }

    setField(fieldName, fieldValue){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                this.infoFields[i].setValue(fieldValue);
                break;
            }
        }
    }

    setFieldFontSize(fieldName, fontSize){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                this.infoFields[i].setLabelFontSize(fontSize);
                this.infoFields[i].setInputFieldFontSize(fontSize);
                break;
            }
        }
    }

    setFieldFontColor(fieldName, fontColor){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                this.infoFields[i].setNameFieldColor(fontColor);
                this.infoFields[i].setInputFieldColor(fontColor);
                break;
            }
        }
    }

    setFieldBkgColor(fieldName, bkgColor){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                this.infoFields[i].setNameFieldBkgColor(bkgColor);
                this.infoFields[i].setInputFieldBkgColor(bkgColor);
                break;
            }
        }
    }

    hideField(fieldName, hideOnlyName = false, hideOnlyValue = false){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                if(hideOnlyName){
                    this.infoFields[i].showValueLabel();
                    this.infoFields[i].setValueAlign("center");
                }
                else  if(hideOnlyValue){
                    this.infoFields[i].showNameLabel();
                    this.infoFields[i].setNameAlign("center");
                }
                else{
                    this.infoFields[i].hide();
                }             
                break;
            }
        }
    }

    showField(fieldName, showOnlyName = false, showOnlyValue = false){
        for(var i = 0; i < this.infoFields.length; i++){
            if(this.infoFields[i].getName() === fieldName){
                if(showOnlyName){
                    this.infoFields[i].showNameLabel();
                }
                else  if(showOnlyValue){
                    this.infoFields[i].showValueLabel();
                }
                else{
                    this.infoFields[i].show();
                }       
                break;
            }
        }
    }

    reset(){
        for(var i = 0; i < this.infoFields.length; i++){
            this.infoFields[i].setValue(0);
        }
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