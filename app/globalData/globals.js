module.exports = {};

module.exports.DB_NAME = "WorderDB.json";
module.exports.DB_DIR_NAME = "db";
module.exports.LAST_DB_USED_FILE_NAME = "LastDBUsed.txt";
module.exports.USER_DATA_DIR_NAME = "user_data";

module.exports.MAIN_MENU_SCREEN_TYPE = "MAIN_MENU_SCREEN_TYPE";
module.exports.HOME_SCREEN_TYPE = "HOME_SCREEN_TYPE";
module.exports.WORD_LIST_SCREEN_TYPE = "WORD_LIST_SCREEN_TYPE";
module.exports.CONFIGURE_DB_SCREEN_TYPE = "CONFIGURE_DB_SCREEN_TYPE";
module.exports.EXAM_SCREEN_TYPE = "EXAM_SCREEN_TYPE";

module.exports.DIALOG_ADD_EDIT_WORD = 1;
module.exports.DIALOG_MESSAGE_BOX = 2;
module.exports.DIALOG_MESSAGE_BOX_YES_NO = 3;
module.exports.DIALOG_ADD_CATEGORY = 4;
module.exports.CONTEXT_MENU = 5;
module.exports.DIALOG_CREATE_NEW_CATEGORY = 6;
module.exports.DIALOG_TOOLTIP = 7;

module.exports.WORD_ADD_MODE = "WORD_ADD_MODE";
module.exports.WORD_UPDATE_MODE = "WORD_UPDATE_MODE";

//----------------------------------------------------------

module.exports.SECTION_BUTTONS_COUNT = 3;
module.exports.MAX_WORD_COUNT_PER_PAGE = 300;
module.exports.SECONDS_TO_WAIT_BEFORE_TOOLTIP = 2;

module.exports.currentVersion = 1.01;


var CLASS_NAMES = {
    GlobalContainerClassName: "globalContainerClass",

    ScreenContainerClassName: "screensContainerClass",

    HomeScreenClassName: "homeScreenClass",
    LogoClass: "logoClass",
    HomeTextContinerClass: "homeTextContainerClass",

    LabelClass: "labelClass",

    MainMenuBkgClassName: "mainMenuBkgClass",
    MainMenuButtonsClassName: "mainMenuButtonsClass",
    MainMenuButtonsActiveClassName: "mainMenuButtonsActiveClass",

    MainMenuSecondaryButtonsClassName: "mainMenuSecondaryButtonsClass",

    SecondaryButtonsContainerClass: "secondaryButtonsContainerClass",
   
    InputFieldClassName: "inputFieldClass",
    InputLabelClassName: "inputLabelClass",
    InputContainerClassName: "inputContainerClass",
    InputContainerWithButtonClassName: "inputContainerWithButtonClass",
    InputContainerCategoryClassName: "inputContainerCategoryClass",

    AddCategoryBkgClassName: "addCategoryBkgClass",
    AddCategoryDDMenuBkgClassName: "addCategoryDDMenuBkgClass",
    AddCategoryButtonClassName: "addCategoryButtonsClass",

    WordInputBkgClassName: "wordInputBkgClass",
    WordInputButtonsClassName: "wordInputButtonsClass",
    WordInputCloseButtonClassName: "wordInputCloseButtonClass",
    WordContainerClassName: "wordContainerClass",
    WordInputCategorySeparatorClassName: "wordInputCategorySeparator",
    WordMarker: "wordMarker",
    WordMarkerActive: "wordMarkerActive",
    WordMarkerSmall: "wordMarkerSmall",
    WordMarkerSmallActive: "wordMarkerSmallActive",

    DropdownMenuClassName: "dropdownMenuItemClass",
    DropdownMenuActiveClassName: "dropdownMenuActiveItemClass",

    ContextContainer: "contextContainer",

    AddWordOkButtonsClassName: "addWordOkButtonsClass",

    CurrentSelectionClassName: "currentSelectionClass",
    GlobalTransparentBkg: "globalTransparentBkg",

    ListLabelClassName : "listLabelClass",
    WMContainerClassName: "wmContainerClass",
    EditButtonClassName: "editButtonClass",
    ContextButtonClassName: "contextButtonClass",
    ContextButtonActiveClassName: "contextButtonActiveClass",
    DeleteButtonClassName: "deleteButtonClass",
    CustomButtonClassName: "customButtonClass",
    CustomButtonClassState2Name: "customButtonClassState2",
    SmallButtonClass: "smallButtonClass",
    SmallButtonClassState2: "smallButtonClassState2",
    AddWordButtonClass: "addWordButton",
    ClearAllMarksButtonClass: "clearAllMarksButton",

    HeaderSectionsClass: "headerSections",
    WMHeaderClass: "wmHeaderClass",

    CreditsClass: "credits",
    CreditsLinkClass: "creditsLink",

    EditWordBkgClassName: "editWordBkgClass",

    MessageBoxClassName: "messageBoxClass",
    MessageHolderClassName: "messageHolderClass",

    InfoSectionClass: "infoSectionClass",

    FlexibleStandardContainer: "flexibleStandardContainer",
    StandardContainer: "standardContainer",

    WordListLabelClassName: "wordListLabelClass",

    SectionChooserClassName: "sectionChooser",
    SectionChooserActiveClassName: "sectionChooserActive",
    SectionChooserInactiveClassName: "sectionChooserInactive",

    CategoryForSelector: "categoryForSelector",
    CategoryForSelectorActive: "categoryForSelectorActive",

    CategorySelectorButton: "categorySelectorButton",
    CategoryMassSelectorButton: "categoryMassSelectorButton",
    CategoryContainer: "categoryContainer",

    WordDetailsCategory: "wordDetailsCategory",

    WordNumberClass: "wordNumber",
    WordLabelClass: "wordLabel",
    WordDateClass: "wordDate",
    NameAndValueClassName: "nameAndValueLabel",

    TableClassName: "tableClass",
    TableCellLeftClass: "tableCellLeft",
    TableCellRightClass: "tableCellRight",

    ItemSelectorBkg: "itemSelectorBkg",
    ItemSelectorItem: "itemSelectorItem",
    ItemSelectorActiveItem: "itemSelectorActiveItem",
    ItemSelectorCurrentSelection: "itemSelectorCurrentSelection",

    CheckBoxContainer: "checkBoxContainer",
    CheckboxFaux: "checkboxFaux",

    RadioButtonsContainer: "radioButtonsContainer",
    RadioButtonsButtonContainer: "radioButtonsButtonContainer",
    RadioButtonReal: "radioButtonReal",

    ArrowStyle: "arrowStyle",

    TooltipClass: "tooltip",
    TooltipArrow: "tooltipArrow"

  
}

module.exports.CLASS_NAMES = CLASS_NAMES;

module.exports.MM_BUTTON_DATA = {
   homeBtn: {
        id:"MB_HOME_ID",
        text: "Home",
        class: CLASS_NAMES.MainMenuButtonsClassName,
        activeClass: CLASS_NAMES.MainMenuButtonsActiveClassName,
        type: "STATE",
        tooltip: "Home screen, general information"
    },

   listWordsBtn: {
        id: "MB_LIST_WORDS_ID",
        text: "List Words",
        class: CLASS_NAMES.MainMenuButtonsClassName,
        activeClass: CLASS_NAMES.MainMenuButtonsActiveClassName,
        type: "STATE",
        tooltip: "The vocabulary is here"
    },

    examScreenBtn: {
        id: "MB_START_EXAM_ID",
        text: "Start Exam",
        class: CLASS_NAMES.MainMenuButtonsClassName,
        activeClass: CLASS_NAMES.MainMenuButtonsActiveClassName,
        type: "STATE",
        tooltip: "Check your knowledge with this exam"
    },

    configureDBBtn: {
        id: "CONFIGURE_DB_ID",
        text: "Configure DB",
        class: CLASS_NAMES.MainMenuButtonsClassName,
        activeClass: CLASS_NAMES.MainMenuButtonsActiveClassName,
        type: "STATE",
        tooltip: "Select or create new word database"
    },

    interval1: {
        type: "INTERVAL"    
    },

    addWordBtn: {
        id: "ADD_WORD_ID",
        text: "Add New Word",
        class: CLASS_NAMES.MainMenuSecondaryButtonsClassName,
        type: "FUNC",
        tooltip: "Shortcut to add new word"    
    },
    
    addCategoryBtn: {
        id: "ADD_CATEGORY_ID",
        text: "Add New Category",
        class: CLASS_NAMES.MainMenuSecondaryButtonsClassName,
        type: "FUNC",
        tooltip: "Shortcut to add new category"
    } 
}

module.exports.WORD_INPUT_BUTTON_DATA = {
    CloseBtnID: "WORD_INPUT_CLOSE_ID",
    CloseBtnText: "Close",
    SaveBtnID: "WORD_INPUT_SAVE_ID",
    SaveBtnText: "Save Word",
    NewCategoryBtnID: "NEW_CATEGORY_ID",
    NewCategoryText: "Add Category"
}

module.exports.SORT_ORDERS = {
    INITIAL_ORDER: "INITIAL_ORDER",
    ALPHABET_ORDER: "ALPHABET_ORDER",
    DATE_ORDER: "DATE_ORDER"
}

module.exports.createHTMLElement = function(elementType, elementClass = null){
    var tempElement = document.createElement(elementType);
    tempElement.className = elementClass;

    return(tempElement);
 }



