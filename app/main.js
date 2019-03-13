const {app, BrowserWindow, shell} = require('electron');
const fs = require('fs');
const path = require('path');

const DB_DIR_NAME = require("./globalData/globals").DB_DIR_NAME;

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    //mainWindow.openDevTools();
    mainWindow.webContents.loadFile('app/index.html');
});

app.on('window-all-closed', () => {
    app.quit();
  });

const readFilesInDBDir = (callback) => {
    var pathDB = path.resolve(__dirname, DB_DIR_NAME);
    fs.readdir(pathDB, callback);   
}

const openExplorerInDBDir = () => {
    var pathDB = path.resolve(__dirname, DB_DIR_NAME);
    var params = "start" + ' "" ' + pathDB;
  
    require('child_process').exec(params);
}

const saveTextFile = (filename, folder, content, callback) => {   
        var pathFile = path.resolve(__dirname, folder, filename);
        fs.writeFile(pathFile, content, {encoding: 'utf-8', flag: 'w+'}, callback);
}

const readTextFile = (filename, folder, callback) => {
        var pathFile = path.resolve(__dirname, folder, filename);
        fs.readFile(pathFile, {encoding: 'utf-8'}, callback);
}

const saveDB = (db, dbName, callback) => {
    var pathDB = path.resolve(__dirname, DB_DIR_NAME, dbName);
        let DB_stringified = "";
        if(db !== ""){
            DB_stringified = JSON.stringify(db);
        }
        fs.writeFile(pathDB, DB_stringified, {encoding: 'utf-8'}, callback);
}

const loadDB = function(dbName, encoding, callback){
    var pathDB = path.resolve(__dirname, DB_DIR_NAME, dbName);
    fs.access(pathDB, fs.constants.F_OK, (err) => {
        if(err){
            fs.open(dbName, 'w+', (err, fd)=>{
                fs.readFile(pathDB, {encoding: 'utf-8'}, callback);
                return;
            });
        }
        else{
            fs.readFile(pathDB, {encoding: 'utf-8'}, callback);
        }
      });  
};

const goToLink = function(){
    shell.openExternal("http://www.blite.eu");
}

module.exports.saveDB = saveDB;
module.exports.loadDB = loadDB;
module.exports.saveTextFile = saveTextFile;
module.exports.readTextFile = readTextFile;
module.exports.readFilesInDBDir = readFilesInDBDir;
module.exports.openExplorerInDBDir = openExplorerInDBDir;
module.exports.goToLink = goToLink;



