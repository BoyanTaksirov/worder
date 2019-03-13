module.exports.setButtonInactive = function(button){
    button.style.backgroundColor = "rgb(76, 76, 76)";
    button.style.borderColor = "rgb(139, 139, 139)";
    button.disabled = true;
}

module.exports.setButtonActive = function(button){
    button.style.backgroundColor = null;
    button.style.borderColor = null;
    button.disabled = false;
}

module.exports.compareArrays = function(arr1,arr2){
  
    if(!arr1  || !arr2) return;
   
    let result;
   
    arr1.forEach(e1=>arr2.forEach(e2=>{              
          if(e1 !== e2 ){
             result = false
          }else{
             result = true
          }
     })
   )   
   return result;   
 }

 function GetElementInsideContainer(containerID, childID) {
    var elm = document.getElementById(childID);
    var parent = elm ? elm.parentNode : {};
    return (parent.id && parent.id === containerID) ? elm : {};
}

 module.exports.createButton = function(text, handler, id = null, cssClass = CLASS_NAMES.MainMenuButtonsClassName){
    var tempButton = document.createElement("button");
    tempButton.id = id;
    if(handler){
        tempButton.addEventListener("mousedown", handler);
    }
    tempButton.className = cssClass;
    tempButton.innerHTML = text;

    return(tempButton);
}

module.exports.parseColorToNumbers = function(color){
    var colorNumbers = ["","",""];

    var addMode = false;
    var index = -1;
    for(var i = 0; i < color.length; i++){
        var code = color.charCodeAt(i);
        if (code < 48 || code > 57){
            addMode = false;
            continue;
        }
        else{
                if(addMode){
                    colorNumbers[index] += color[i];
                }
                else{
                    addMode = true;
                    index++;
                    colorNumbers[index] += color[i];
                }
        }
    }

    for(var n = 0; n < colorNumbers.length; n++ ){
        colorNumbers[n] = parseInt(colorNumbers[n]);
    }

    return colorNumbers;
}

module.exports.checkColorLightOrDark = function(colorArray){
    let arraySum = colorArray.reduce((accumulator, currentValue) => accumulator + currentValue);

    if(arraySum > 450){
        return true;
    }
    else{
        return false;
    }
}

module.exports.removeWhitespacesFromStartAndEnd = function(word){
    var startIndex = 0;
    var endIndex = 0;
    for(var i = 0; i < word.length; i++){
        var symbol = word.charAt(i);
        if(symbol === " "){
            continue;
        }
        startIndex = i;
        break;
    }

    for(var n =  word.length - 1; n >= 0; n--){
        var symbol = word.charAt(n);
        if(symbol === " "){
            continue;
        }
        endIndex = n + 1
        break;
    }

    return(word.substring(startIndex, endIndex));
}


module.exports.getMonthName = function(monthNumber){
    switch(monthNumber){
        case 0:
        return "January";
        break;

        case 1:
        return "February";
        break;

        case 2:
        return "March";
        break;

        case 3:
        return "April";
        break;

        case 4:
        return "May";
        break;

        case 5:
        return "June";
        break;

        case 6:
        return "July";
        break;

        case 7:
        return "August";
        break;

        case 8:
        return "September";
        break;

        case 9:
        return "October";
        break;

        case 10:
        return "November";
        break;

        case 11:
        return "December";
        break;
    }
}

module.exports.prependZero = function(value){
    if(value.toString().length === 1){
        return "0" + value;
    }

    return value;
}