const shortid = require('shortid'); 

const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const compareArrays = require("../utils/utils").compareArrays;

module.exports = class CategorySelector{
    constructor(pContainer, categoryClickCallback = null){
                this.parentContainer = pContainer;

                this.categoryClickCallback = categoryClickCallback;

                this.onCategoryClick = this.onCategoryClick.bind(this);
                this.onCategorySelectedClick = this.onCategorySelectedClick.bind(this);
                this.onSelectButtonClicked = this.onSelectButtonClicked.bind(this);
                this.onSelectReverseButtonClicked = this.onSelectReverseButtonClicked.bind(this);
                this.onMassSelectButtonClicked = this.onMassSelectButtonClicked.bind(this);
                this.onMassSelectReverseButtonClicked = this.onMassSelectReverseButtonClicked.bind(this);

                this.categories;

                this.create();
    }

    create(){
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.FlexibleStandardContainer;
        this.container.style.display = "inline-flex";
        this.container.style.flexDirection = "row";
        this.container.style.alignItems = "center";
        this.container.style.backgroundColor = "rgb(78, 121, 167)";
        this.container.style.border = "2px rgb(24, 28, 30) solid";
        this.container.style.width = "30rem";
        this.container.style.height = "15rem";
        
        this.categoryList = document.createElement("div");
        this.categoryList.style.order = 1;
        this.categoryList.className = CLASS_NAMES.CategoryContainer;
        this.categoryList.style.backgroundColor = "rgb(114, 175, 223)";
        this.container.appendChild(this.categoryList);

        this.buttonsContainer = document.createElement("div");
        this.buttonsContainer.style.position = "relative";
        this.buttonsContainer.style.order = 2;
        this.buttonsContainer.style.width = "20%";
        this.buttonsContainer.style.height = "95%";
        this.container.appendChild(this.buttonsContainer);

        this.buttonsContainerSecond = document.createElement("div");
        this.buttonsContainerSecond.style.position = "absolute";
        this.buttonsContainerSecond.style.height = "90%";
        this.buttonsContainerSecond.style.width = "100%";
        this.buttonsContainerSecond.style.top = 0;
        this.buttonsContainerSecond.style.right = 0;
        this.buttonsContainerSecond.style.bottom = 0;
        this.buttonsContainerSecond.style.left = 0;
        this.buttonsContainerSecond.style.margin = "auto";
        this.buttonsContainer.appendChild(this.buttonsContainerSecond);

        this.selectButton = document.createElement("button");
        this.selectButton.innerText = ">";
        this.selectButton.className = CLASS_NAMES.CategorySelectorButton;
        this.selectButton.style.order = 1;
        this.selectButton.style.width = "65%";
        this.selectButton.style.height = "22%";
        this.selectButton.addEventListener("mousedown", this.onSelectButtonClicked);
        this.buttonsContainerSecond.appendChild(this.selectButton);

        this.selectReverseButton = document.createElement("button");
        this.selectReverseButton.innerText = "<";
        this.selectReverseButton.className = CLASS_NAMES.CategorySelectorButton;
        this.selectReverseButton.style.order = 2;
        this.selectReverseButton.style.width = "65%";
        this.selectReverseButton.style.height = "22%";
        this.selectReverseButton.addEventListener("mousedown", this.onSelectReverseButtonClicked);
        this.buttonsContainerSecond.appendChild(this.selectReverseButton);

        this.massSelectButton = document.createElement("button");
        this.massSelectButton.innerText = ">>";
        this.massSelectButton.className = CLASS_NAMES.CategoryMassSelectorButton;
        this.massSelectButton.style.order = 3;
        this.massSelectButton.style.width = "65%";
        this.massSelectButton.style.height = "22%";
        this.massSelectButton.addEventListener("mousedown", this.onMassSelectButtonClicked);
        this.buttonsContainerSecond.appendChild(this.massSelectButton);

        this.massSelectReverseButton = document.createElement("button");
        this.massSelectReverseButton.innerText = "<<";
        this.massSelectReverseButton.className = CLASS_NAMES.CategoryMassSelectorButton;
        this.massSelectReverseButton.style.order = 4;
        this.massSelectReverseButton.style.width = "65%";
        this.massSelectReverseButton.style.height = "22%";
        this.massSelectReverseButton.addEventListener("mousedown", this.onMassSelectReverseButtonClicked);
        this.buttonsContainerSecond.appendChild(this.massSelectReverseButton);

        this.categoriesSelectedList = document.createElement("div");
        this.categoriesSelectedList.style.order = 3;
        this.categoriesSelectedList.className = CLASS_NAMES.CategoryContainer;
        this.categoriesSelectedList.style.backgroundColor = "rgb(187, 216, 240)";
        this.container.appendChild(this.categoriesSelectedList);
    }

    createCategory(categoryName){
        let tempCategory = document.createElement("div");
            tempCategory.innerText = categoryName;
            tempCategory.className = CLASS_NAMES.CategoryForSelector;
            tempCategory.categoryId = shortid.generate();
            tempCategory.addEventListener("mousedown", this.onCategoryClick);
            this.categoryList.appendChild(tempCategory);
    }

    createCategorySelected(categoryName){
        let tempCategory = document.createElement("div");
            tempCategory.innerText = categoryName;
            tempCategory.className = CLASS_NAMES.CategoryForSelector;
            tempCategory.addEventListener("mousedown", this.onCategorySelectedClick);
            this.categoriesSelectedList.appendChild(tempCategory);
    }

    setCategories(newCategories){
        this.clearCategories();

        for(let i = 0; i < newCategories.length; i++){
            this.createCategory(newCategories[i])
        }
   }

   clearCategories(){
        this.clearCategoriesList();
        this.clearCategoriesSelectedList();
   }

   clearCategoriesList(){
       var categoryItems = this.categoryList.childNodes.length;
    for(var i = 0; i < categoryItems; i++){                   
          this.categoryList.childNodes[0].removeEventListener("mousedown", this.onCategoryClick);
          this.categoryList.removeChild(this.categoryList.childNodes[0]);                                     
    }
   }

   clearCategoriesSelectedList(){
    var categoryItems = this.categoriesSelectedList.childNodes.length;
    for(var i = 0; i < categoryItems; i++){
          this.categoriesSelectedList.childNodes[0].removeEventListener("mousedown", this.onCategorySelectedClick);
          this.categoriesSelectedList.removeChild(this.categoriesSelectedList.childNodes[0]);                        
    }
   }

   onCategoryClick(e){
        this.currentCategorySelection = e.currentTarget;
        for(var i = 0; i < this.categoryList.childNodes.length; i++){
            this.categoryList.childNodes[i].className = CLASS_NAMES.CategoryForSelector;
        }           
        e.currentTarget.className = CLASS_NAMES.CategoryForSelectorActive;
   }

   onCategorySelectedClick(e){
    this.selectedCategorySelection = e.currentTarget;
    for(var i = 0; i < this.categoriesSelectedList.childNodes.length; i++){
        this.categoriesSelectedList.childNodes[i].className = CLASS_NAMES.CategoryForSelector;
    }
    e.currentTarget.className = CLASS_NAMES.CategoryForSelectorActive;
}

   onSelectButtonClicked(e){
      if(this.currentCategorySelection){
            this.currentCategorySelection.removeEventListener("mousedown", this.onCategoryClick);
            this.currentCategorySelection.addEventListener("mousedown", this.onCategorySelectedClick);
            this.categoryList.removeChild(this.currentCategorySelection);
            this.currentCategorySelection.className = CLASS_NAMES.CategoryForSelector;
            this.categoriesSelectedList.appendChild(this.currentCategorySelection);
            this.currentCategorySelection = null;

            if(this.categoryClickCallback){
                this.categoryClickCallback();
            }          
      }
   }

   onSelectReverseButtonClicked(e){
    if(this.selectedCategorySelection){
        this.selectedCategorySelection.removeEventListener("mousedown", this.onCategorySelectedClick);
        this.selectedCategorySelection.addEventListener("mousedown", this.onCategoryClick);
        this.categoriesSelectedList.removeChild(this.selectedCategorySelection);
        this.selectedCategorySelection.className = CLASS_NAMES.CategoryForSelector;
        this.categoryList.appendChild(this.selectedCategorySelection);
        this.selectedCategorySelection = null;

        if(this.categoryClickCallback){
            this.categoryClickCallback();
        }        
     }
   }

   onMassSelectButtonClicked(e){
        var categoryItems = this.categoryList.childNodes.length;
        for(var i = 0; i < categoryItems; i++){   
         
          var tempCategory = this.categoryList.removeChild(this.categoryList.childNodes[0]); 
          tempCategory.removeEventListener("mousedown", this.onCategoryClick);
          
          this.categoriesSelectedList.appendChild(tempCategory);
          tempCategory.addEventListener("mousedown", this.onCategorySelectedClick);  
          tempCategory.className = CLASS_NAMES.CategoryForSelector;
         
          this.currentCategorySelection = null;
          this.selectedCategorySelection = null;
        }

          if(this.categoryClickCallback){
              this.categoryClickCallback();
          }          
   }

   onMassSelectReverseButtonClicked(){
    var categoryItems = this.categoriesSelectedList.childNodes.length;
    for(var i = 0; i < categoryItems; i++){   
     
      var tempCategory = this.categoriesSelectedList.removeChild(this.categoriesSelectedList.childNodes[0]); 
      tempCategory.removeEventListener("mousedown", this.onCategorySelectedClick);
      
      this.categoryList.appendChild(tempCategory);
      tempCategory.addEventListener("mousedown", this.onCategoryClick);  
      tempCategory.className = CLASS_NAMES.CategoryForSelector;
     
      this.currentCategorySelection = null;
      this.selectedCategorySelection = null;
    }

      if(this.categoryClickCallback){
          this.categoryClickCallback();
      }      
   }

   getSelectedCategories(){
        var categoriesSelected = [];

        for(let i = 0; i < this.categoriesSelectedList.childNodes.length; i++){
            categoriesSelected.push(this.categoriesSelectedList.childNodes[i].innerText);
        }

        return(categoriesSelected);
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

    setStyleProperty(property, value){
        this.container.style[property] = value;
    }

    open(newCategories){
        if(!compareArrays(this.categories, newCategories)){  
                this.categories = newCategories.slice();
                this.setCategories(this.categories);
            }  
        this.addToContainer();       
    }

    clear(){
        this.clearCategories();
        this.selectButton.removeEventListener("mousedown", this.onSelectButtonClicked);
        this.selectReverseButton.removeEventListener("mousedown", this.onSelectReverseButtonClicked);
        this.massSelectButton.removeEventListener("mousedown", this.onMassSelectButtonClicked);
        this.massSelectReverseButton.removeEventListener("mousedown", this.onMassSelectReverseButtonClicked);
        this.removeFromContainer();       
    }
}