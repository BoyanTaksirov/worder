const NameAndValue = require("../components/name_and_value");
const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;

module.exports = class Timer{
    constructor(intervalMs){
        this.interval = intervalMs;
        this.handler;
        this.startTime;

        this.timeFromStartSeconds = 0;
        this.beginTimeString = "00:00:00";
        this.onInterval = this.onInterval.bind(this);

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.FlexibleStandardContainer;
        this.container.style.margin = "0.5rem auto";
        this.displayField = new NameAndValue(this.container, "time passed: ", this.beginTimeString);
    }

    start(){
        this.stop();
        this.displayField.setValue(this.beginTimeString);
        var thisRef = this;
        this.handler = setInterval(thisRef.onInterval, this.interval);
        this.startTime = new Date();
    }

    stop(){
        clearInterval(this.handler);
    }

    reset(){
        this.stop();
        this.timeFromStartSeconds = 0;
        this.displayField.setValue(this.beginTimeString);
    }

    onInterval(){
        var currentTime = new Date();
        this.timeFromStartSeconds = (currentTime.getTime() - this.startTime.getTime())/1000;
        var minutes = Math.floor(this.timeFromStartSeconds/60);
        var hours = Math.floor(minutes/60);

        var secondsLabel;
        if(minutes > 0){
            secondsLabel = this.timeFromStartSeconds % 60;
        }
        else{
             secondsLabel = this.timeFromStartSeconds;
        }

        secondsLabel = this.prependZero(secondsLabel);

        var minutesLabel;
        if(hours > 0){
            minutesLabel = minutes % 60;
        }
        else{
            minutesLabel = minutes;
        }

        minutesLabel = this.prependZero(minutesLabel);

        var hoursLabel = hours;      

        hoursLabel = this.prependZero(hoursLabel);

        var timeString = hoursLabel + ":" + minutesLabel + ":" + secondsLabel;

        this.displayField.setValue(timeString);
    }

    prependZero(value){
        value = Math.round(value);
        if(String(value).length === 1){
            value = "0" + value;
        }

        return value;
    }

    setStyleProperty(property, value){
        this.container.style[property] = value;
    }

    setDisplayWidth(width){
        this.container.style.width = width;
    }

    setBkgColor(color){
        this.container.style.backgroundColor = color;
    }

    setBorder(border){
        this.container.style.border = border;
    }

    setFontColor(color){
        this.container.style.color = color;
    }

    addToContainer(pContainer){
        this.parentContainer = pContainer;

        if(!this.container.parentNode)   
        {
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer(){
        this.stop();
        if(this.container.parentNode)   
        {
            this.parentContainer.removeChild(this.container);   
        }
    }

    clear(){
        this.stop();
        this.removeFromContainer();
    }
}