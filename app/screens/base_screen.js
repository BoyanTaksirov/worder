module.exports = class BaseScreen{
   constructor(pContainer, screenType){
        this.parentContainer = pContainer;
        this.screenType = screenType;       
   }

   create(){
        throw("'create()' method must be implemented in child class!");
    };

    clear(){
        throw("'clear()' method must be implemented in child class!");
    };
}