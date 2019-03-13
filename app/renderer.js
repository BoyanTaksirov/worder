const Controler = require("./controler/controler");
const DB_Connection = require("./globalData/DB_Connection");

var controler;

window.onload = () => { initApp() }

function initApp() {
    createControler();
}

function createControler(){
    controler = new Controler();
}






