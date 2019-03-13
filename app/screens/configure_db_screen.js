const remote = require('electron').remote;
const readFilesInDBDir = remote.require('./main.js').readFilesInDBDir;
const openExplorerInDBDir = remote.require('./main.js').openExplorerInDBDir;
const saveDB = remote.require('./main.js').saveDB;

const FeatureScreen = require("./feature_screen");
const CONFIGURE_DB_SCREEN_TYPE = require("../globalData/globals").CONFIGURE_DB_SCREEN_TYPE;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const StandardButton = require("../components/standard_button");
const InputAndLabel = require("../components/input_and_label");
const ListSelector = require("../components/list_selector");

module.exports = class ConfigureDBScreen extends FeatureScreen{
    constructor(pContainer, fSwitch, controler){
        super(pContainer, fSwitch, CONFIGURE_DB_SCREEN_TYPE);
        this.controler = controler;

        this.forbiddenSymbols = '\\/:*?"<>|';

        this.setDBList = this.setDBList.bind(this);
        this.onDBChosen = this.onDBChosen.bind(this);
        this.openExplorerInDBFolder = this.openExplorerInDBFolder.bind(this);
        this.onNewDBCreate = this.onNewDBCreate.bind(this);
        this.onNewDBSaved = this.onNewDBSaved.bind(this);
        this.validateNameAndProceed = this.validateNameAndProceed.bind(this);

        this.create();

        readFilesInDBDir(this.setDBList);
    }

    create(){
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.WordInputBkgClassName;
        this.parentContainer.appendChild(this.container);

        this.interfaceContainer = document.createElement("div");
        this.interfaceContainer.className = CLASS_NAMES.FlexibleStandardContainer;
        this.interfaceContainer.style.backgroundColor = "rgb(50, 59, 63)";
        this.interfaceContainer.style.width = "30%";
        this.interfaceContainer.style.minWidth = "25rem";
        this.interfaceContainer.style.margin = "2rem auto";
        this.interfaceContainer.style.padding = "1rem";
        this.container.appendChild(this.interfaceContainer);

        this.selector = new ListSelector(this.interfaceContainer);  
        this.selector.setStyleProperty("backgroundColor", "rgb(69, 134, 163)");
        this.selector.setStyleProperty("width", "100%");
        this.selector.setStyleProperty("min-width", "20rem");
        
        this.newDBName = "";

        this.loadSelectedDBButton = new StandardButton("Load Selected DB", this.onDBChosen);
        this.loadSelectedDBButton.setStyleProperty("marginTop", "1rem");
        this.selector.addElementToContainer(this.loadSelectedDBButton.getContainer());
        
        this.newDBNameContainer = document.createElement("div");
        this.newDBNameContainer.className = CLASS_NAMES.FlexibleStandardContainer;
        this.newDBNameContainer.style.width = "100%";
        this.newDBNameContainer.style.backgroundColor = "rgb(69, 134, 163)";
        this.newDBNameContainer.style.minWidth = "20rem";
        this.newDBNameContainer.style.margin = "1rem 0";
        this.newDBNameContainer.style.padding = "1rem";
        this.interfaceContainer.appendChild(this.newDBNameContainer);
        this.newDBField = new InputAndLabel(CLASS_NAMES.InputContainerClassName, CLASS_NAMES.InputLabelClassName, CLASS_NAMES.InputFieldClassName, 
            this.newDBNameContainer, "New DB Name:");

        this.newDBField.setStyleProperty("width", "100%");
        this.newDBField.setStyleProperty("textAlign", "center");
        this.newDBField.setStyleProperty("margin", "1rem 0");
        this.newDBField.addToContainer();

        this.addNewDBButton = new StandardButton("Create new DB", this.onNewDBCreate);
        this.addNewDBButton.addToContainer(this.newDBNameContainer);

        let spaceV = document.createElement("div");
        spaceV.style.height = "1rem";
        this.container.appendChild(spaceV);

        this.selectDBButton = new StandardButton("Open DB Folder", this.openExplorerInDBFolder);
        this.selectDBButton.addToContainer(this.interfaceContainer);
    }

    openExplorerInDBFolder(){
        openExplorerInDBDir();
    }

    onNewDBCreate(){
        this.newDBName = this.newDBField.getText();
        readFilesInDBDir(this.validateNameAndProceed);  
    }

    validateNameAndProceed(err, items){
        if(err){
            this.controler.openMessageBox("DB read error!", null);
            this.newDBName  = "";
            return;
        }

        if(!this.validateDBName(this.newDBName)){
            this.controler.openMessageBox("DB name not valid!", null);
            this.newDBName  = "";
            return;
        }

        for(var i = 0; i < items.length; i++){
            if(this.newDBName  + ".json" === items[i]){
                this.controler.openMessageBox("DB name exists!", null);
                this.newDBName  = "";
                return;
            }
        }

        this.newDBName = this.newDBName + ".json";
        saveDB("", this.newDBName, this.onNewDBSaved);
        this.newDBName = "";
    }

    validateDBName(dbName){
        if(!dbName || dbName === ""){
            return false;
        }
        for(var i = 0; i < this.forbiddenSymbols.length; i++){           
            if(dbName.indexOf(this.forbiddenSymbols[i]) != -1){
                return false;
            }
        }
        return true;
    }

    onNewDBSaved(err){
        if(!err){
            readFilesInDBDir(this.setDBList);
        }
    }

    setDBList(err, items){
        if(!err){
            this.selector.setItems(items);
            this.selector.setSelectedItem(this.controler.getDBName());
        }      
    }

    onDBChosen(){
        var dbName = this.selector.getSelectedItem();
        if(dbName === this.controler.getDBName()){
            this.controler.openMessageBox("DB " + dbName + " already loaded!", null);
            return;
        }
        this.controler.loadDatabase(dbName);
        this.selector.setSelectedItem(dbName);
    }

    clear(){     
        this.parentContainer.removeChild(this.container);
        this.newDBField.clear();
        this.selector.clear();
        this.loadSelectedDBButton.clear();
        this.addNewDBButton.clear();
        this.selectDBButton.clear();
    }
}