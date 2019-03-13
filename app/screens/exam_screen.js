const FeatureScreen = require("./feature_screen");
const EXAM_SCREEN_TYPE = require("../globalData/globals").EXAM_SCREEN_TYPE;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

const ExamSettingsPanel = require("../components/exam_settings_panel");
const ExamPanel = require("../components/exam_panel");

module.exports = class ExamScreen extends FeatureScreen{
    constructor(pContainer, fSwitch, activateTopMenu, deactivateTopMenu, controler){
        super(pContainer, fSwitch, EXAM_SCREEN_TYPE);

        this.controler = controler;

        this.activateTopMenuHandler = activateTopMenu;
        this.deactivateTopMenuHandler = deactivateTopMenu;

        this.onSettingsApplied = this.onSettingsApplied.bind(this);
        this.onExitExam = this.onExitExam.bind(this);
       
        this.create();
    }

    create() {
        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.WordInputBkgClassName;
        this.parentContainer.appendChild(this.container);

        this.examSettingsPanel = new ExamSettingsPanel(this.container, this.controler, this.onSettingsApplied);
        this.examPanel = new ExamPanel(this.container, this.onExitExam, this.controler);

        this.examSettingsPanel.open();
    }

    onSettingsApplied(settings){
        this.examSettingsPanel.close();
        this.deactivateTopMenuHandler();
        this.examPanel.open(settings);
    }

    onExitExam(){
        this.examPanel.close();
        this.activateTopMenuHandler();
        this.examSettingsPanel.open();      
    }

    updateView(){
        this.examSettingsPanel.update();
    }

    clear(){  
        this.controler.closeAllDialogs();      
        this.examPanel.clear();
        this.examSettingsPanel.clear();

        if(this.container.parentNode)   
        {
            this.parentContainer.removeChild(this.container);
        }
    }
}