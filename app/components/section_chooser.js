const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const SECTION_BUTTONS_COUNT = require("../globalData/globals").SECTION_BUTTONS_COUNT;

module.exports = class SectionChooser{
    constructor(pContainer, sectionButtonHandler){
        this.parentContainer = pContainer;
        this.sectionButtonHandler = sectionButtonHandler;

        this.currentStartIndex = 0;

        this.dynamicMode = false;
        this.scrollLeftButton;
        this.scrollRightButton;
        this.scrollMaxLeftButton;
        this.scrollMaxRightButton;

        this.onSectionButtonClick = this.onSectionButtonClick.bind(this);
        this.onScrollLeftClick = this.onScrollLeftClick.bind(this);
        this.onScrollRightClick = this.onScrollRightClick.bind(this);
        this.onScrollMaxLeftClick = this.onScrollMaxLeftClick.bind(this);
        this.onScrollMaxRightClick = this.onScrollMaxRightClick.bind(this);

        this.container = document.createElement("div");
        this.container.style.textAlign = "center";
        this.container.style.margin = "1rem";
        this.sectionButtons = [];

        this.sectionsCount;
        this.selectedSectionIndex = -1;

        this.OPENED;
    }

    createSectionButtons(){
        this.removeSectionButtons();

        var lastIndex = this.sectionsCount;
        if(this.sectionsCount > SECTION_BUTTONS_COUNT || this.currentStartIndex > 0){
            this.dynamicMode = true;
        }
        else{
            this.dynamicMode = false;
        }

        this.scrollMaxLeftButton = this.createButton("SCROLL_MAX_LEFT", "<<", this.container, this.onScrollMaxLeftClick);
        this.scrollLeftButton = this.createButton("SCROLL_LEFT", "<", this.container, this.onScrollLeftClick);

        if(this.currentStartIndex <= 0){
            this.scrollMaxLeftButton.className = CLASS_NAMES.SectionChooserInactiveClassName;
            this.scrollLeftButton.className = CLASS_NAMES.SectionChooserInactiveClassName;
        }
        else{
            this.scrollMaxLeftButton.className = CLASS_NAMES.SectionChooserClassName;
            this.scrollLeftButton.className = CLASS_NAMES.SectionChooserClassName;
        }

        this.sectionButtons.push(this.scrollMaxLeftButton);
        this.sectionButtons.push(this.scrollLeftButton);

        //--------------------------------create sections buttons------------------------------------
        var endIndex = this.sectionsCount;
        if(this.dynamicMode){
            endIndex = this.currentStartIndex + SECTION_BUTTONS_COUNT;
            if(endIndex >= this.sectionsCount){
                endIndex = this.sectionsCount;
            }
        }

        for(var i = this.currentStartIndex; i < endIndex; i++){
            this.sectionButtons.push(this.createButton(i, i+1));
            if(i === this.selectedSectionIndex){
                    this.sectionButtons[this.sectionButtons.length - 1].className = CLASS_NAMES.SectionChooserActiveClassName;
            }
        }
          //--------------------------------end create sections buttons------------------------------------
    
        this.scrollRightButton = this.createButton("SCROLL_RIGHT", ">", this.container, this.onScrollRightClick);
        this.scrollMaxRightButton = this.createButton("SCROLL_MAX_RIGHT", ">>", this.container, this.onScrollMaxRightClick);

        if(this.currentStartIndex >= this.sectionsCount - SECTION_BUTTONS_COUNT){
            this.scrollMaxRightButton.className = CLASS_NAMES.SectionChooserInactiveClassName;
            this.scrollRightButton.className = CLASS_NAMES.SectionChooserInactiveClassName;
        }
        else{
            this.scrollMaxRightButton.className = CLASS_NAMES.SectionChooserClassName;        
            this.scrollRightButton.className = CLASS_NAMES.SectionChooserClassName;     
        }
       
        this.sectionButtons.push(this.scrollRightButton);
        this.sectionButtons.push(this.scrollMaxRightButton);              
    }

    createButton(id,text, parent = this.container, handler = this.onSectionButtonClick){
        var tempButton = document.createElement("button");
        tempButton.menuButtonID = id;
        tempButton.addEventListener("mousedown", handler);    
        tempButton.innerText = text;
        tempButton.className = CLASS_NAMES.SectionChooserClassName;
        parent.appendChild(tempButton);  

        return(tempButton);
    }

    removeSectionButtons(){
        for(var i = 0; i < this.sectionButtons.length; i++){
            this.sectionButtons[i].removeEventListener("mousedown", this.onSectionButtonClick);  

            if(this.sectionButtons[i].parentNode){
                this.container.removeChild(this.sectionButtons[i]);
            }
        }

        this.sectionButtons = [];
    }

    onSectionButtonClick(e){
        for(var i = 0; i < this.sectionButtons.length; i++){
            this.sectionButtons[i].className = CLASS_NAMES.SectionChooserClassName;
        }

        e.currentTarget.className = CLASS_NAMES.SectionChooserActiveClassName;

        this.selectedSectionIndex = e.currentTarget.menuButtonID;

        this.sectionButtonHandler();
    }

    onScrollLeftClick(e){
        this.currentStartIndex--;
        if(this.currentStartIndex < 0){
            this.currentStartIndex = 0;
        }      

        this.createSectionButtons();
    }

    onScrollMaxLeftClick(e){
        this.currentStartIndex = 0;
        this.createSectionButtons();
    }

    onScrollRightClick(e){
        this.currentStartIndex++;
        if(this.currentStartIndex > this.sectionsCount - SECTION_BUTTONS_COUNT){
            this.currentStartIndex = this.sectionsCount - SECTION_BUTTONS_COUNT;
        }

        if(this.currentStartIndex < 0){
            this.currentStartIndex = 0;
        }

        this.createSectionButtons();
    }

    onScrollMaxRightClick(e){      
        this.currentStartIndex = this.sectionsCount - SECTION_BUTTONS_COUNT;
        this.createSectionButtons();
    }

    addToContainer(){
        if(!this.container.parentNode){       
            this.parentContainer.appendChild(this.container);
            this.OPENED = true;
        }
    }

    removeFromContainer(){
        if(this.container.parentNode){
            this.parentContainer.removeChild(this.container);
            this.OPENED = false;
        }            
    }

    getCurrentSection(){
        if(this.selectedSectionIndex < 0){
            this.selectedSectionIndex = 0;
        }
        return(this.selectedSectionIndex);
    }

    open(numberOfAllWords, numberOfWordsPerPage, setSectionIndexToZero = false){
        if(this.selectedSectionIndex === -1 || setSectionIndexToZero){
            this.selectedSectionIndex = 0;
        }
      
        this.sectionsCount = Math.ceil(numberOfAllWords/numberOfWordsPerPage);
        if(this.currentStartIndex > this.sectionsCount - 1){
            this.currentStartIndex = this.sectionsCount - 1;

            if(this.currentStartIndex < 0){
                this.currentStartIndex = 0;
            }
        }

        if(this.selectedSectionIndex > this.sectionsCount - 1){
            this.selectedSectionIndex = this.sectionsCount - 1;
        }

        this.createSectionButtons();
        this.addToContainer();
    }

    clear(){
        this.removeSectionButtons();
        this.removeFromContainer();
    }
    
}