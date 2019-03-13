const LabelAndButton = require("./label_and_button");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class DropdownMenu{
    constructor(pContainer, onCategoryChosen, onCategoryDelete){
        this.parentContainer = pContainer;
        this.onCategoryChosen = onCategoryChosen;
        this.onCategoryDelete = onCategoryDelete;
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.AddCategoryDDMenuBkgClassName;

        this.items = [];

        this.setCategory = this.setCategory.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.addToContainer();
    }

    setItems(newItems){
        this.clearItems();

         for(let i = 0; i < newItems.length; i++)
         {          
             let categoryRow = new LabelAndButton(this.container, newItems[i], "delete", this.setCategory, this.onDelete);

             this.items.push(categoryRow);
         }
    }

    clearItems(){
        for(let i = 0; i < this.items.length; i++)
        {
          this.items[i].clear();
        }
        this.items = [];
    }

    setCategory(categoryName){
         this.onCategoryChosen(categoryName);    
    }

    onDelete(categoryName){
        this.onCategoryDelete(categoryName);
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