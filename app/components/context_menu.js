const StandardButton = require("./standard_button");
const StateButton = require("./state_button");
const ButtonState = require("../states/button_state");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const setButtonActive = require("../utils/utils").setButtonActive;
const setButtonInactive = require("../utils/utils").setButtonInactive;

module.exports = class ContextMenu{
    constructor(pContainer, editHandler, deleteHandler, addWordHandler, 
        copyWordHandler, pasteWordHandler, searchForSynonymsHandler, exitSearchHandler){
        this.parentContainer = pContainer;

        this.editHandler = editHandler;
        this.deleteHandler = deleteHandler;
        this.addWordHandler = addWordHandler;
        this.copyWordHandler = copyWordHandler;
        this.pasteWordHandler = pasteWordHandler;
        this.searchForSynonymsHandler = searchForSynonymsHandler;
        this.exitSearchHandler = exitSearchHandler;

        this.onEditClicked = this.onEditClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onAddWordClicked = this.onAddWordClicked.bind(this);
        this.onCopyWordClicked = this.onCopyWordClicked.bind(this);
        this.onPasteWordClicked = this.onPasteWordClicked.bind(this);
        this.searchForSynonyms = this.searchForSynonyms.bind(this);
        this.onSearchClicked = this.onSearchClicked.bind(this);
        this.onExitSearch = this.onExitSearch.bind(this);
        this.update = this.update.bind(this);

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.ContextContainer;

        this.arrow = document.createElement("div");
        this.arrow.className = CLASS_NAMES.ArrowStyle;
        this.container.appendChild(this.arrow);

        this.wordIndexField = document.createElement("div");
        this.wordIndexField.style.fontSize = "0.7rem";
        this.wordIndexField.style.textAlign = "center";
        this.container.appendChild(this.wordIndexField);

        this.editButton = new StandardButton("edit", this.onEditClicked, CLASS_NAMES.ContextButtonClassName);
        this.editButton.addToContainer(this.container);

        this.deleteButton = new StandardButton("delete", this.onDeleteClicked, CLASS_NAMES.ContextButtonActiveClassName);     
        this.deleteButton.addToContainer(this.container);

        this.addWordUnderRow = new StandardButton("add word here", this.onAddWordClicked, CLASS_NAMES.ContextButtonClassName);
        this.addWordUnderRow.addToContainer(this.container);

        var searchSynonymsButtonStates = [
            new ButtonState("search synonyms", CLASS_NAMES.ContextButtonClassName, this.onSearchClicked, null),
            new ButtonState("exit search", CLASS_NAMES.ContextButtonActiveClassName, this.onExitSearch, null),
        ];

        this.searchSynonymsButton = new StateButton(searchSynonymsButtonStates, "SEARCH_SYNONYMS_ID");
        this.searchSynonymsButton.addToContainer(this.container);

        this.copyButton = new StandardButton("copy", this.onCopyWordClicked, CLASS_NAMES.ContextButtonClassName);
        this.copyButton.addToContainer(this.container);

        this.pasteButton = new StandardButton("paste", this.onPasteWordClicked, CLASS_NAMES.ContextButtonClassName);
        this.pasteButton.setButtonInactive();
        this.pasteButton.addToContainer(this.container);

        this.wordObject;
        this.fieldIndex;

        this.container.style.visibility = "hidden";
        this.addToContainer();

        this.OPENED = false;
    }

    onEditClicked(){
        this.editHandler(this.wordObject);
    }

    onDeleteClicked(){
        this.deleteHandler(this.wordObject);
    }

    onAddWordClicked(){
        this.addWordHandler(this.wordObject);
    }

    onCopyWordClicked(){
        this.copyWordHandler(this.wordObject);
        this.pasteButton.setButtonActive();
    }

    onPasteWordClicked(){
        this.pasteWordHandler(this.wordObject);
        this.pasteButton.setButtonInactive();
    }

    onSearchClicked(state){
        this.searchForSynonymsHandler(this.wordObject);       
    }

    onExitSearch(state){
            this.exitSearchHandler("CONTEXT_MENU");
    }

    setSearchButtonState(state){
        this.searchSynonymsButton.setState(state);
    }

    searchForSynonyms(){
        this.searchForSynonymsHandler(this.wordObject);
    }

    addToContainer(){
        if(!this.container.parentNode)
        {
            this.parentContainer.appendChild(this.container);
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

    update(yCoord, fieldIndex, wordObject){
         if(!this.OPENED){
            this.open();
         }
         if(this.container.style.visibility === "hidden"){
            this.container.style.visibility = "visible";
         }
         this.wordObject = wordObject;
         this.container.style.top = yCoord + "px";
         this.fieldIndex = fieldIndex;
         this.wordIndexField.innerText = this.fieldIndex + 1;
    }

    open(){
        this.container.style.visibility = "visible";
        this.OPENED = true;
    }

    close(){
        this.container.style.visibility = "hidden";
        this.OPENED = false;
    }

    clear(){
        this.editButton.clear();
        this.deleteButton.clear();
        this.addWordUnderRow.clear();
        this.searchSynonymsButton.clear();
        this.copyButton.clear();
        this.pasteButton.clear();
    }
}