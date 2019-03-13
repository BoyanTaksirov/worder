const InputAndLabel = require("./input_and_label");
const DropdownMenu = require("./dropdown_menu");
const StandardButton = require("./standard_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class AddCategoryDialog{
    constructor(pContainer, controler){
        this.OPENED = false;

        this.parentContainer = pContainer;
        this.controler = controler;

        this.onCategoryChosen = this.onCategoryChosen.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onCategoryWillDelete = this.onCategoryWillDelete.bind(this);
        this.onOkPressed = this.onOkPressed.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.positionDialog = this.positionDialog.bind(this);

        this.okHandler;
        this.createNewCategoryHandler;

        this.screenBkg = document.createElement("div");
        this.screenBkg.className = CLASS_NAMES.GlobalTransparentBkg;
      
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.AddCategoryBkgClassName;
        this.screenBkg.appendChild(this.container);

        this.boxLabel = document.createElement("div");
        this.boxLabel.innerText = "Please, pick a category from list below, or add a new one.";
        this.container.appendChild(this.boxLabel);

        this.emptyLine1 = document.createElement("br");
        this.container.appendChild(this.emptyLine1);

        this.currentSelection = document.createElement("div");
        this.currentSelection.innerText = "current selection:";
        this.container.appendChild(this.currentSelection);

        this.currentSelectionValue = document.createElement("input");
        this.currentSelectionValue.type = "text";
        this.currentSelectionValue.readOnly = true;
        this.currentSelectionValue.className = CLASS_NAMES.CurrentSelectionClassName;
        this.currentSelectionValue.value = "none selected";
        this.container.appendChild(this.currentSelectionValue);
        
        this.dropdownMenu = new DropdownMenu(this.container, this.onCategoryChosen, this.onCategoryWillDelete);

        this.okButton = new StandardButton("Ok", this.onButtonClick, CLASS_NAMES.EditButtonClassName, "OK_ID");
        this.okButton.addToContainer(this.container);
        this.okButton.setStyleProperty("margin-top", "1rem");

        this.cancelButton = new StandardButton("Close", this.onButtonClick, CLASS_NAMES.EditButtonClassName, "CANCEL_ID");
        this.cancelButton.addToContainer(this.container);
        this.cancelButton.setStyleProperty("margin-top", "1rem");

        this.newCategoryGroup = document.createElement("div");
        this.newCategoryGroup.className = CLASS_NAMES.StandardContainer;
        this.newCategoryGroup.style.borderColor = "white";
        this.newCategoryGroup.style.backgroundColor = "rgb(19, 76, 102)";
        this.newCategoryGroup.style.marginTop = "1rem";
        this.container.appendChild(this.newCategoryGroup);

        this.newCategory = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.newCategoryGroup, "New Category:");
        this.newCategory.setStyleProperty("width", "100%");
        this.newCategory.setStyleProperty("margin", "0");
        this.newCategory.setStyleProperty("textAlign", "center");
        this.newCategory.setLabelFontColor("white");
        this.newCategory.setBorderColor("white");
        this.newCategory.addToContainer();
        this.newCategory.setEventListener("input", this.onCategoryChange);

        this.addNewButton = new StandardButton("Create New Category", this.onButtonClick, CLASS_NAMES.EditButtonClassName, "NEW_CATEGORY_ID");
        this.addNewButton.addToContainer(this.newCategoryGroup);
        this.addNewButton.setStyleProperty("margin-top", "1rem");

        this.currentCategory;     
    };


    updateCategoryItems(newCategories){
        this.dropdownMenu.setItems(newCategories);
        this.currentSelectionValue.value = "none selected";
        for(var i = 0; i < newCategories.length; i++){
            if(this.currentCategory === newCategories[i]){
                return;
            }
        }    
        this.currentCategory = "";      
    }

    onCategoryChosen(categoryName){
       this.currentCategory = categoryName;
       this.currentSelectionValue.value = this.currentCategory;
    }

    onCategoryWillDelete(categoryName){
        this.willDeleteHandler(categoryName);
    }

    onCategoryChange(e){
        this.addNewButton.setButtonActive();
    }

    onButtonClick(id, buttonInstance){
        if(id === "NEW_CATEGORY_ID"){
            this.createNewCategory();
        }
        else if(id === "OK_ID"){
            this.onOkPressed();
        }
        else if(id === "CANCEL_ID"){
            this.cancelHandler();
        }
    }

    onOkPressed(){
        if(!this.currentCategory || this.currentCategory === ""){
            return;
        }
        this.okHandler(this.currentCategory);
    }

    createNewCategory(){
        let newCategoryName = this.newCategory.getText();
        var categorySaved = false;
        if(newCategoryName !== "")
        {
            categorySaved = this.createNewCategoryHandler(newCategoryName);

            if(categorySaved){
                this.onCategoryChosen(newCategoryName);
                this.addNewButton.setButtonInactive();
            }
            else{
                this.controler.openMessageBox("Category not saved. Probably such category exists in database.");
            }
        }
        else{
            this.controler.openMessageBox("Category name not entered!");
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
        if(!this.screenBkg.parentNode){ 
            this.screenBkg.style.opacity = 0;
            this.screenBkg.style.animation = "elementAnimationFadeIn 0.3s forwards";      
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

    open(okHandler, cancelHandler, createNewCategoryHandler, categories, willDeleteHandler){
        window.removeEventListener("resize", this.positionDialog);
        window.addEventListener("resize", this.positionDialog);
        
        this.okHandler = okHandler;
        this.cancelHandler = cancelHandler;
        this.createNewCategoryHandler = createNewCategoryHandler;
        this.willDeleteHandler = willDeleteHandler;

        this.updateCategoryItems(categories);
        this.addToContainer();
        this.positionDialog(null);
    }

    close(){
        window.removeEventListener("resize", this.positionDialog);

        this.newCategory.setText("");
        this.currentSelectionValue.value = "none selected";

        this.okHandler = null;
        this.createNewCategoryHandler = null;

        this.removeFromContainer();
    }

}
