var BaseScreen = require("./base_screen");

module.exports = class FeatureScreen extends BaseScreen{
    constructor(pContainer, fSwitch, screenType) { 
        super(pContainer, screenType);    
        this.bkg;     
        this.switchFunction = fSwitch;   
    } 
    
   
}

