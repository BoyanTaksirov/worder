const InputAndLabelHorizontal = require("./input_and_label_horizontal");
const ListSelectorMini = require("./list_selector_mini");
const CheckBox = require("./check_box");
const CategorySelector = require("./category_selector");
const StandardButton = require("./standard_button");
const SORT_ORDERS = require("../globalData/globals").SORT_ORDERS;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const MAX_WORD_COUNT_PER_PAGE = require("../globalData/globals").MAX_WORD_COUNT_PER_PAGE;
const SHOW_ALL_CATEGORIES_ID = "SHOW_ALL_CATEGORIES_ID";
const FILTER_BY_CATEGORIES_ID = "FILTER_BY_CATEGORIES_ID";
const SHOW_DATE_ID = "SHOW_DATE_ID";
const SHOW_MARKED_ID = "SHOW_MARKED_ID";

module.exports = class WordListSettingsPanel{
        constructor(pContainer, controler, okHandler, closeHandler = null){
            this.parentContainer = pContainer;
            this.controler = controler;
            this.okHandler = okHandler;
            this.closeHandler = closeHandler;

            this.onApplyClicked = this.onApplyClicked.bind(this);
            this.onCloseClicked = this.onCloseClicked.bind(this);
            this.setOkButtonActive = this.setOkButtonActive.bind(this);
            this.setOkButtonInactive = this.setOkButtonInactive.bind(this);
            this.onSortChosen = this.onSortChosen.bind(this);

            this.currentCategorySelection;
            this.currentSortOrderSelectionId = SORT_ORDERS.INITIAL_ORDER;

            this.initialize = true;

            this.OPENED = false;

            this.sortCriteria = [
                                    {sortName: "Initial Order",
                                     sortId: SORT_ORDERS.INITIAL_ORDER}, 

                                    {sortName: "Sort By Alphabet Order",
                                     sortId: SORT_ORDERS.ALPHABET_ORDER}, 

                                    {sortName: "Sort by Date",
                                     sortId: SORT_ORDERS.DATE_ORDER}
                                ];
          
            this.create();
        }

        create(){
            var bkgColor = "rgb(133, 180, 219)";

            this.container = document.createElement("div");
            this.container.className = CLASS_NAMES.StandardContainer;
            this.container.style.minWidth = "40rem";
            this.container.style.border = "none";
            this.container.style.padding = "0.5rem";
            this.container.style.backgroundColor = bkgColor;

            this.controlsHolder = document.createElement("div");
            this.controlsHolder.style.display = "flex";
            this.controlsHolder.style.flexDirection = "row";
            this.controlsHolder.style.flexWrap = "wrap";
            this.controlsHolder.style.padding = "1rem";
            this.container.appendChild(this.controlsHolder);

            this.wordCountAndSortContainer = document.createElement("div");
            this.wordCountAndSortContainer.className = CLASS_NAMES.StandardContainer;
            this.wordCountAndSortContainer.style.marginRight = "1rem";
            this.wordCountAndSortContainer.style.marginBottom = "1rem";
            this.wordCountAndSortContainer.style.width = "23rem";
            this.wordCountAndSortContainer.style.backgroundColor = "rgb(187, 216, 240)";
            this.controlsHolder.appendChild(this.wordCountAndSortContainer);

            this.wordCountPerPageField = new InputAndLabelHorizontal(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
                this.wordCountAndSortContainer, "word count per page:");
                this.wordCountPerPageField.setWidth("20rem");
                this.wordCountPerPageField.setStyleProperty("margin-right", "1rem");
                this.wordCountPerPageField.setStyleProperty("margin-bottom", "1rem");
                this.wordCountPerPageField.setEventListener("change", this.setOkButtonActive);
                this.wordCountPerPageField.addToContainer();

                this.sortSelector = new ListSelectorMini(this.wordCountAndSortContainer, this.onSortChosen);
                this.sortSelector.setItems(this.sortCriteria, this.currentSortOrderSelectionId);

                this.categorySelectorHolder = document.createElement("div");
                this.categorySelectorHolder.className = CLASS_NAMES.StandardContainer;
                this.categorySelectorHolder.style.width = "25rem";
                this.categorySelectorHolder.style.height = "20rem";
                this.categorySelectorHolder.style.marginRight = "1rem";
                this.categorySelectorHolder.style.marginBottom = "1rem";
                this.categorySelectorHolder.style.backgroundColor = "rgb(187, 216, 240)";
                this.controlsHolder.appendChild(this.categorySelectorHolder);

                this.categoryLabel = document.createElement("div");
                this.categoryLabel.innerText = "Select categories you'd like to be seen along with a given word";
                this.categoryLabel.style.marginBottom = "0.5rem";
                this.categorySelectorHolder.appendChild(this.categoryLabel);

                this.categorySelector = new CategorySelector(this.categorySelectorHolder, this.setOkButtonActive);
                this.categorySelector.setStyleProperty("height", "85%");
                this.categorySelector.setStyleProperty("width", "100%");
                this.categorySelector.open(this.controler.getCategories());
   
                this.checkBoxHolder = document.createElement("div");
                this.checkBoxHolder.className = CLASS_NAMES.StandardContainer;
                this.checkBoxHolder.style.marginRight = "1rem";
                this.checkBoxHolder.style.marginBottom = "1rem";
                this.checkBoxHolder.style.width = "23rem";
                this.checkBoxHolder.style.backgroundColor = "rgb(187, 216, 240)";
                this.controlsHolder.appendChild(this.checkBoxHolder);

                this.checkBoxFilterByCategories = new CheckBox(this.checkBoxHolder, "filter words by categories chosen", null, FILTER_BY_CATEGORIES_ID);
                this.checkBoxFilterByCategories.addToContainer();

                this.checkBoxMarked = new CheckBox(this.checkBoxHolder, "include marked words only", null, SHOW_MARKED_ID);
                this.checkBoxMarked.addToContainer();

                this.checkBoxDate = new CheckBox(this.checkBoxHolder, "show date of record", null, SHOW_DATE_ID);
                this.checkBoxDate.addToContainer();              

                this.applyButton = new StandardButton("apply settings", this.onApplyClicked);
                this.applyButton.setStyleProperty("margin", "0.2rem");
                this.applyButton.setStyleProperty("width", "10rem");
                this.applyButton.setStyleProperty("height", "3rem");
                this.applyButton.addToContainer(this.container);
        }

        updateView(){
            this.categorySelector.open(this.controler.getCategories());
        }

        setOkButtonActive(){
                this.applyButton.setButtonActive(); 
        }

        setOkButtonInactive(immediately = false){
            if(immediately){
                this.applyButton.setButtonInactive();
                return;
            }
    
            var that = this;      
            setTimeout(function(){
                        that.applyButton.setButtonInactive();
                        }, 500);          
        }

       onSortChosen(sortId){
            this.currentSortOrderSelectionId = sortId;
       }

        onApplyClicked(e){
            var wordCountPerPage = this.wordCountPerPageField.getText();
            if (isNaN(wordCountPerPage) || wordCountPerPage < 1){ 
                this.controler.openMessageBox("Word count per page not valid!");
                return;
            } 
            else if(wordCountPerPage > MAX_WORD_COUNT_PER_PAGE){
                this.controler.openMessageBox("Word count per page exceeds max limit of " + MAX_WORD_COUNT_PER_PAGE);
                return;
            }  

            var categoriesSelected = this.categorySelector.getSelectedCategories();

            var params = {categoriesSelected: categoriesSelected,
                          useCategoriesForFiltering: this.checkBoxFilterByCategories.getStatus(),
                          includeOnlyMarked: this.checkBoxMarked.getStatus(),
                          showDate: this.checkBoxDate.getStatus(),
                          sortOrder: this.currentSortOrderSelectionId,
                          wordCountPerPage: wordCountPerPage};

            if(this.okHandler){
                this.okHandler(params);
            }  

        }

        onCloseClicked(e){
            this.closeHandler();
            this.close();
        }

        addToContainer(){
            if(!this.container.parentNode)
            {
                this.container.style.opacity = 0;
                this.container.style.animation = "elementAnimationFadeIn 0.5s forwards";
                this.parentContainer.appendChild(this.container);
                this.OPENED = true;
            }
        }

        addBefore(element){
            if(!this.container.parentNode)
            {
                this.parentContainer.insertBefore(this.container, element);
                this.OPENED = true;
            }
        }
  
        removeFromContainer(){
            if(this.container.parentNode)
            {
                this.parentContainer.removeChild(this.container);
                this.OPENED = false;
            }
        }

        open(elementAfter = null){

            if(this.initialize){
                this.wordCountPerPageField.setText(this.controler.getWordsCountPerPage());
                //categories.open
                this.initialize = false;
            }
           
            if(!elementAfter){
                this.addToContainer();
            }
            else{
                this.addBefore(elementAfter);
            }

            this.categorySelector.open(this.controler.getCategories());

            //this.setOkButtonInactive(true);
        }

        close(){
            this.removeFromContainer();
        }

        clear(){
            this.removeFromContainer();
            this.applyButton.clear();
            this.wordCountPerPageField.clear();
            this.categorySelector.clear();
            this.sortSelector.clear();
            this.checkBoxFilterByCategories.clear();
            this.checkBoxMarked.clear();
            this.checkBoxDate.clear();
        }
}