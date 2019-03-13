const InputAndLabel = require("./input_and_label");
const DropdownMenu = require("./dropdown_menu");
const StandardButton = require("./standard_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class CreateNewCategoryDialog{
    constructor(pContainer, controler){
        this.OPENED = false;

        this.parentContainer = pContainer;
        this.controler = controler;

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onCategoryWillDelete = this.onCategoryWillDelete.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.positionDialog = this.positionDialog.bind(this);

        this.createNewCategoryHandler;

        this.screenBkg = document.createElement("div");
        this.screenBkg.className = CLASS_NAMES.GlobalTransparentBkg;
      
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.AddCategoryBkgClassName;
        this.container.style.border = "2px white solid";
        this.screenBkg.appendChild(this.container);

        this.textLabel = document.createElement("div");
        this.textLabel.style.color = "white";
        this.textLabel.innerText = "Create or delete categories. Please remember, that if a deleted category is added to an existing word, it will be restored in database.";
        this.container.appendChild(this.textLabel);
        
        this.dropdownMenu = new DropdownMenu(this.container, null, this.onCategoryWillDelete);
       
        this.emptyLine1 = document.createElement("br");
        this.container.appendChild(this.emptyLine1);

        this.newCategoryGroup = document.createElement("div");
        this.newCategoryGroup.className = CLASS_NAMES.StandardContainer;
        this.newCategoryGroup.style.borderColor = "white";
        this.newCategoryGroup.style.backgroundColor = "rgb(19, 76, 102)";
        this.newCategoryGroup.style.marginTop = "1rem";
        this.container.appendChild(this.newCategoryGroup);

        this.boxLabel = document.createElement("div");
        this.boxLabel.style.color = "white";
        this.boxLabel.innerText = "Please, type the name of the category you want to create and press button below.";
        this.newCategoryGroup.appendChild(this.boxLabel);

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

        this.closeButton = new StandardButton("Close", this.onButtonClick, CLASS_NAMES.EditButtonClassName, "CLOSE_ID");
        this.closeButton.addToContainer(this.container);
        this.closeButton.setStyleProperty("margin", "1rem auto");


        this.currentCategory;  
    
    };

    updateCategoryItems(newCategories){
        this.dropdownMenu.setItems(newCategories);
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
        else if(id === "CLOSE_ID"){
            this.cancelHandler();
        }
    }

    createNewCategory(){
        let newCategoryName = this.newCategory.getText();
        var categorySaved = false;
        if(newCategoryName !== "")
        {
            categorySaved = this.createNewCategoryHandler(newCategoryName);

            if(categorySaved){
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

    open(createNewCategoryHandler, categories, willDeleteHandler, cancelHandler){
        window.removeEventListener("resize", this.positionDialog);
        window.addEventListener("resize", this.positionDialog);
          
        this.createNewCategoryHandler = createNewCategoryHandler;
        this.willDeleteHandler = willDeleteHandler;
        this.cancelHandler = cancelHandler;

        this.updateCategoryItems(categories);
        this.newCategory.setText("");

        this.addToContainer();
        this.positionDialog(null);
    }

    close(){
        window.removeEventListener("resize", this.positionDialog);

        this.createNewCategoryHandler = null;

        this.removeFromContainer();
    }

}
