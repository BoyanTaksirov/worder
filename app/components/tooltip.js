const CLASS_NAMES = require("../globalData/globals").CLASS_NAMES;
const SECONDS_TO_WAIT_BEFORE_TOOLTIP = require("../globalData/globals").SECONDS_TO_WAIT_BEFORE_TOOLTIP;

module.exports = class Tooltip{
    constructor(pContainer){
        this.parentContainer = pContainer;

        this.startTooltip = this.startTooltip.bind(this);

        this.container = document.createElement("div");
        this.container.className = CLASS_NAMES.TooltipClass;

        this.arrow = document.createElement("div");
        this.arrow.className = CLASS_NAMES.TooltipArrow;
        this.container.appendChild(this.arrow);

        this.textHolder = document.createElement("div");
        this.container.appendChild(this.textHolder);

        this.parentContainer.appendChild(this.container);

        this.timeoutHandler = null;

        this.OPENED = false;
    }
       
    open(explaination, coords){
        this.clearHandlers();
        var that = this;    
        this.timeoutHandler = setTimeout(function(){that.startTooltip(explaination, coords)}, SECONDS_TO_WAIT_BEFORE_TOOLTIP*1000)
    }

    startTooltip(explaination, coords){
        this.clearHandlers();
        this.textHolder.innerText = explaination;
        this.container.style.top = coords.top + "px";
        this.container.style.left = coords.left + "px";
        this.container.style.opacity = 0;
        this.container.style.display = "block";
        this.container.style.animation = "elementAnimationFadeIn 0.5s forwards";
        this.container.style.zIndex = 10000;
        this.OPENED = true;
    }

    close(){        
        this.clearHandlers();
        this.container.style.display = "none";
        this.OPENED = false;
    }

    clearHandlers(){
        clearTimeout(this.timeoutHandler);
    }
}