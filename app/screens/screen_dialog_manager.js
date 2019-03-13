const DIALOG_ADD_EDIT_WORD = require("../globalData/globals.js").DIALOG_ADD_EDIT_WORD;
const DIALOG_MESSAGE_BOX = require("../globalData/globals.js").DIALOG_MESSAGE_BOX;
const DIALOG_MESSAGE_BOX_YES_NO = require("../globalData/globals.js").DIALOG_MESSAGE_BOX_YES_NO;
const DIALOG_ADD_CATEGORY = require("../globalData/globals.js").DIALOG_ADD_CATEGORY;
const DIALOG_CREATE_NEW_CATEGORY = require("../globalData/globals.js").DIALOG_CREATE_NEW_CATEGORY;
const DIALOG_TOOLTIP = require("../globalData/globals.js").DIALOG_TOOLTIP;

const AddEditWordDialog = require("../components/add_edit_word_dialog");
const AddCategoryDialog = require("../components/add_category_dialog");
const CreateNewCategoryDialog = require("../components/create_new_category_dialog");
const MessageBox = require("../components/message_box");
const MessageBoxYesNo = require("../components/message_box_yes_no");
const Tooltip = require("../components/tooltip");

module.exports = class ScreenDialogManager{
    constructor(screenContainer, database, controler){
        this.screenContainer = screenContainer;
        this.wordDatabase = database;
        this.controler = controler;

        this.addEditWordDialog = new AddEditWordDialog(this.screenContainer, this.controler);
        this.addCategoryDialog = new AddCategoryDialog(this.screenContainer, this.controler);
        this.createNewCategoryDialog = new CreateNewCategoryDialog(this.screenContainer, this.controler);

        this.messageBox = new MessageBox(this.screenContainer);
        this.messageBoxYesNo = new MessageBoxYesNo(this.screenContainer);

        this.tooltip = new Tooltip(this.screenContainer);
    }

    openDialog(dialogID, dArguments){
        switch(dialogID){
            case DIALOG_ADD_EDIT_WORD:
                 this.addEditWordDialog.open(dArguments);
                break;

            case DIALOG_ADD_CATEGORY:
                 this.addCategoryDialog.open(...dArguments);
                break;
                
            case DIALOG_CREATE_NEW_CATEGORY:
                this.createNewCategoryDialog.open(...dArguments);
               break; 
                
            case DIALOG_MESSAGE_BOX:
                this.messageBox.open(...dArguments);
               break;
               
            case DIALOG_MESSAGE_BOX_YES_NO:
               this.messageBoxYesNo.open(...dArguments);
              break;  

            case DIALOG_TOOLTIP:
              this.tooltip.open(...dArguments);
             break;  
        }
    }

    closeDialog(dialogID){
        switch(dialogID){
            case DIALOG_ADD_EDIT_WORD:
                 this.addEditWordDialog.close();
                 break;

            case DIALOG_ADD_CATEGORY:
                 this.addCategoryDialog.close();
                 break; 
                 
            case DIALOG_CREATE_NEW_CATEGORY:
                 this.createNewCategoryDialog.close();
                 
            case DIALOG_MESSAGE_BOX:
                 this.messageBox.close();
                break; 
                
            case DIALOG_MESSAGE_BOX_YES_NO:
                 this.messageBoxYesNo.close();
                break;

            case DIALOG_TOOLTIP:
                 this.tooltip.close();
                break;  
        }
    }

    applyDialogFunction(dialogID, functionName, newArguments){
        switch(dialogID){
            case DIALOG_ADD_EDIT_WORD:
            if(this.addEditWordDialog.OPENED){
                   this.addEditWordDialog[functionName](...newArguments);
                }
                break;

            case DIALOG_ADD_CATEGORY:
            if(this.addCategoryDialog.OPENED){           
                 this.addCategoryDialog[functionName](...newArguments);
                }
                break; 
                
            case DIALOG_CREATE_NEW_CATEGORY:
            if(this.createNewCategoryDialog.OPENED){           
                     this.createNewCategoryDialog[functionName](...newArguments);
                }
                break;  
                
            case DIALOG_MESSAGE_BOX:
            if(this.messageBox.OPENED){           
                    this.messageBox[functionName](...newArguments);
                }
                break;  
                
            case DIALOG_MESSAGE_BOX_YES_NO:
            if(this.messageBoxYesNo.OPENED){           
                    this.messageBox[functionName](...newArguments);
                }
                break;
        }
    }

    checkIfDialogOpened(dialogID){
        switch(dialogID){
            case DIALOG_ADD_EDIT_WORD:
                if(this.addEditWordDialog.OPENED){
                    return true;
                    }
                return false;

            case DIALOG_ADD_CATEGORY:
                if(this.addCategoryDialog.OPENED){           
                    return true;
                    }
                return false;

            case DIALOG_CREATE_NEW_CATEGORY:
                if(this.createNewCategoryDialog.OPENED){           
                    return true;
                    }
                return false;
                
            case DIALOG_MESSAGE_BOX:
                if(this.messageBox.OPENED){           
                    return true;
                    }
                    return false;
                
            case DIALOG_MESSAGE_BOX_YES_NO:
                if(this.messageBoxYesNo.OPENED){           
                    return true;
                    }
                return false;

            case DIALOG_DIALOG_TOOLTIP:
                if(this.tooltip.OPENED){           
                    return true;
                    }
                return false;
        }
    }
}
