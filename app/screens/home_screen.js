const FeatureScreen = require("./feature_screen");
const HOME_SCREEN_TYPE = require("../globalData/globals").HOME_SCREEN_TYPE;
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class HomeScreen extends FeatureScreen{
    constructor(pContainer, fSwitch, controler) {  
        super(pContainer, fSwitch, HOME_SCREEN_TYPE)
        this.controler = controler;
        this.create();
    }

    create() {
        this.container = document.createElement("div");      
        this.container.className = CLASS_NAMES.HomeScreenClassName;
        //this.container.className = CLASS_NAMES.WordInputBkgClassName;
        this.parentContainer.appendChild(this.container);   

        this.logo = document.createElement("img");
        this.logo.src = "resources/LogoBig.png";
        this.logo.className = CLASS_NAMES.LogoClass;

        this.container.appendChild(this.logo);

        this.textContainer = document.createElement("div");
        this.textContainer.className = CLASS_NAMES.HomeTextContinerClass;
        this.container.appendChild(this.textContainer);

        this.textContainer.innerHTML = `<br>
                                        <img src = "resources/LogoBigColor.png" width = 250 />
                                        <h1>WORDER</h1>
                                        <h3>a personal dictionary</h3>
                                        <div>
                                        <p>Building a vocabulary while learning a new language is the most important part of learning process. This program is a personal vocabulary
                                        containing only the words, which user records in it. Along with the particular word, user may add "categories", containing an additional information
                                        about the word. For an example, if user learns, let's say German, he may create a category named "article" and set there the correct article for the noun - der, die or das.
                                        But, of course there are many other options and possible usages of "categories" feature. Verb conjugations or endings in plural, remarks or
                                        anything user wishes to, relevant to the specific characteristics of the language being learned, or user's needs. 
                                        <p>Customizable word exams could help user in learning process.</p>
                                        <p>Marking unlearned words for further learning is also a useful feature</p>
                                        You can receive tooltip help if you hold mouse cursor over an interface element for more than two seconds.
                                        </p>
                                        </div>`;
    }

    clear(){     
        this.controler.closeAllDialogs();
        this.logo = null;
        this.parentContainer.removeChild(this.container);
    }
}



