const SORT_ORDERS = require("../globalData/globals").SORT_ORDERS;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class ListSelectorMini{
    constructor(pContainer, onListItemChosen = null){
        this.parentContainer = pContainer;
        this.onListItemChosenHandler = onListItemChosen;

        this.container = document.createElement("div");

        this.itemContainer = document.createElement("div");
        this.itemContainer.className = CLASS_NAMES.ItemSelectorBkg;
        this.setStyleProperty("marginRight", "1rem");
        this.setStyleProperty("marginBottom", "1rem");
        this.container.appendChild(this.itemContainer);

        this.domItems = [];

        this.currentSelection = null;

        this.onListItemClick = this.onListItemClick.bind(this);

        this.addToContainer();
    }

    setItems(sortItems, selectedId = null){
         this.clearItems();

         for(let i = 0; i < sortItems.length; i++)
         {          
            let labelElement = document.createElement("div");
            labelElement.className = CLASS_NAMES.ItemSelectorItem;

            labelElement.innerText = sortItems[i].sortName;
            labelElement.sortItem = sortItems[i];

            if(selectedId && selectedId === sortItems[i].sortId){
                labelElement.className = CLASS_NAMES.ItemSelectorActiveItem;
                this.currentSelection = sortItems[i];
            }
                     
            labelElement.addEventListener("mousedown", this.onListItemClick);  
            this.itemContainer.appendChild(labelElement);

            this.domItems.push(labelElement);
         }
    }

    clearItems(){
        for(let i = 0; i < this.domItems.length; i++){
          this.domItems[i].removeEventListener("mousedown", this.onListItemClick);  
          this.itemContainer.removeChild(this.domItems[i]);
        }
        this.domItems = [];
    }

    onListItemClick(e){
         for(let i = 0; i < this.domItems.length; i++){
             this.domItems[i].className = CLASS_NAMES.ItemSelectorItem;
         }        
         e.currentTarget.className = CLASS_NAMES.ItemSelectorActiveItem;
         this.currentSelection = e.currentTarget.sortItem;

         if(this.onListItemChosenHandler){           
            this.onListItemChosenHandler(e.currentTarget.sortItem.sortId);              
        }
    }

    getSelectedItem(){
        return this.currentSelection;
    }

    setSelectedItem(selection){
        for(let i = 0; i < this.domItems.length; i++){
            if(this.domItems[i].innerText === selection.sortName){
                this.domItems[i].className = CLASS_NAMES.ItemSelectorActiveItem;
                this.currentSelection = selection;
            }
            else{
                this.domItems[i].className = CLASS_NAMES.ItemSelectorItem;
            }
        }

        if(this.currentSelection === selection){
            if(this.onListItemChosenHandler){               
                this.onListItemChosenHandler(this.currentSelection.sortId);                 
            }
        }
    }

    setStyleProperty(propertyName, propertyValue){
        this.container.style[propertyName] = propertyValue;
    }

    addElementToContainer(element){
        this.container.appendChild(element);
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
        this.clearItems();
    }

    clear(){
        this.removeFromContainer();
    }
}