const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class ListSelector{
    constructor(pContainer, onListItemChosen = null){
        this.parentContainer = pContainer;
        this.onListItemChosen = onListItemChosen;

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.StandardContainer;

        this.itemContainer = document.createElement("div");
        this.itemContainer.className = CLASS_NAMES.ItemSelectorBkg;

        this.selectedLabel = document.createElement("div");
        this.selectedLabel.className = CLASS_NAMES.ItemSelectorCurrentSelection;
        this.selectedLabel.style.height = "3rem";
        this.selectedLabel.style.padding = "0.2rem";
        this.selectedLabel.style.margin = "0.5rem 0";
        this.container.appendChild(this.selectedLabel);
        this.container.appendChild(this.itemContainer);

        this.selectedItem = null;

        this.domItems = [];

        this.onListItemClick = this.onListItemClick.bind(this);

        this.addToContainer();
    }

    setItems(itemNames){
         this.clearItems();

         for(let i = 0; i < itemNames.length; i++)
         {          
            let labelElement = document.createElement("div");
            labelElement.className = CLASS_NAMES.ItemSelectorItem;
            if(itemNames[i].sortName){
                labelElement.innerText = itemNames[i].sortName;
                labelElement.sortID = itemNames[i].sortID;
            }
            else{
                labelElement.innerText = itemNames[i];
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
         this.selectedItem = e.currentTarget.innerText;

         if(this.onListItemChosen){
            if(e.currentTarget.sortID){
                this.onListItemChosen(e.currentTarget.sortID);   
            } 
            else{
                this.onListItemChosen(e.currentTarget.innerText);   
            }
        }
    }

    getSelectedItem(){
        return this.selectedItem;
    }

    setSelectedItem(selected){
        this.selectedItem = selected;
        this.selectedLabel.innerText = selected;
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