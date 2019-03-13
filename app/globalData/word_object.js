module.exports = class WordObjectClass{
    constructor(word, meanings, wordId, wordColor, date, categories, marked){
        var xxx = word instanceof String;
        if(!(typeof word === "string")){
            throw("word must be of String type!");
        }
        if(!(meanings instanceof Array)){
            throw("meanings must be of Array type!");
        }
        if(!(typeof wordId === "string")){
            throw("wordId must be of String type!");
        }
        if(!(typeof wordColor === "string")){
            throw("wordColor must be of String type!");
        }
        if(!(typeof date === "number")){
            throw("date must be of String type!");
        }
        if(!(categories instanceof Array)){
            throw("categories must be of Array type!");
        }

        this.word = word;
        this.meanings = meanings;
        this.wordId = wordId;
        this.wordColor = wordColor;
        this.date = date;
        this.categories = categories;
        this.marked = marked;
    }
}