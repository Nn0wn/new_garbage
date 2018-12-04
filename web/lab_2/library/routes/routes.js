const express = require("express");
const router = express.Router();
const library = require("../library");
const fs = require('fs');
function newBook(){
    return {
        "author": "",
        "name": "",
        "number": 0,
        "publish_date": "0000-00-00",
        "readers": []
    }
}
function responseOK(){
    return {
        "ok": true,
        "message": ""
    }
}
function copyObject(src) {
    return Object.assign({}, src);
}
function responseError(message){
    return {
        "ok": false,
        "message": message
    }
}
function checkBook(book){
    let today = new Date();
    if (new Date(book["publish_date"]) > today){
        return responseError("Book error: publication date is from the future");
    }
    if (book["number"] < 0){
        return responseError("Book error: reader number is below zero");
    }
    if (book["number"] - book["readers"].length < 0){
        return responseError("Book error: too many readers");
    }
    return responseOK();
}
function updateExpired(library){
    for (let i = 0; i < library.length; i++){
        let exp = 0;
        for (let k = 0; k < library[i]["readers"].length; k++){
            if (new Date() > new Date(library[i]["readers"][k]["date_of_return"]))
                exp++;
        }
        library[i]["expired"]=exp;
    }
}
function returnAvailable(library){
    let newLibrary = [];
    for (let i = 0; i < library.length; i++){
        if (library[i]["readers"].length < library[i]["number"])
            newLibrary.push(library[i]);
    }
    return newLibrary;
}
function returnExpired(library){
    let newLibrary = [];
    for (let i = 0; i < library.length; i++){
        if (library[i]["expired"] > 0)
            newLibrary.push(library[i]);
    }
    return newLibrary;
}
function saveLibrary(library){
    //return;
    fs.writeFile("library.json", JSON.stringify(library));
}
router.get("/", (req, res, next)=>{
    res.render('login', {title: 'Login'});
    next();
});
router.put('/book', (req, res, next)=>{
    let book_info = req.body;
    if (("id" in book_info) && ("name" in book_info) && ("author" in book_info) &&
        ("number" in book_info) && ("publish_date" in book_info)) {
        let old_book;
        let is_new = !(book_info["id"] in library);
        if (is_new)
            library[book_info["id"]] = newBook();
        else
            old_book = copyObject(library[book_info["id"]]);
        let book = library[book_info["id"]];
        book["name"] = book_info["name"];
        book["author"] = book_info["author"];
        book["number"] = book_info["number"];
        book["publish_date"] = book_info["publish_date"];
        let ok = checkBook(book);
        res.json(ok);
        if (!ok.ok)
            if (is_new)
                library.splice(book_info["id"], 1);
            else
                library[book_info["id"]] = old_book;
        else
            saveLibrary(library);
    }
    else {
        res.json(responseError("Bad PUT request"));
    }
    next();
});
router.delete('/book/:num([0-9]{1,})', (req, res, next)=>{
    const id = req.params.num;
    if (id in library){
        library.splice(id, 1);
        res.json(responseOK());
        saveLibrary(library);
    }
    else{
        res.json(responseError("Bad DELETE request: there is no such book"));
    }
    next();
});
router.delete('/book/:num([0-9]{1,})/:reader_num([0-9]{1,})', (req, res, next)=>{
    const id = req.params.num;
    const reader = req.params.reader_num;
    if (id in library){
        if (reader in library[id]["readers"]) {
            library[id]["readers"].splice(reader, 1);
            res.json(responseOK());
            saveLibrary(library);
        }
        else
            res.json(responseError("Bad DELETE request: there is no such reader"));
    }
    else{
        res.json(responseError("Bad DELETE request: there is no such book"));
    }
    next();
});
router.post('/book/:num([0-9]{1,})/reader', (req, res, next)=>{
    let reader_info = req.body;
    if (("id" in reader_info) && ("reader" in reader_info)){
        const id = reader_info["id"];
        const reader = reader_info["reader"];
        if ((id in library) && ("name" in reader) && ("date_of_return" in reader)){
            library[id]["readers"].push(reader);
            let ok = checkBook(library[id]);
            res.json(ok);
            if (!ok.ok)
                library[id]["readers"].pop();
            else
                saveLibrary(library);
        }
        else
            res.json(responseError("Bad POST request: there is no such book or corrupted reader"));
    }
    else{
        res.json(responseError("Bad POST request: corrupted reader_info"));
    }
    next();
});
router.get('/index', (req, res, next)=>{
    updateExpired(library);
    res.render('index', {title: 'Index', library: library, label: "Все"});
    next();
});
router.get('/index/available', (req, res, next)=>{
    updateExpired(library);
    res.render('index', {title: 'Index', library: returnAvailable(library), label: "В наличии"});
    next();
});
router.get('/index/expired', (req, res, next)=>{
    updateExpired(library);
    res.render('index', {title: 'Index', library: returnExpired(library), label: "Истек срок"});
    next();
});
router.get('/book/:num([0-9]{1,})', (req, res, next)=>{
    const id = req.params.num;
    let book;
    if (id in library)
        book = library[id];
    else{
        book = newBook();
    }
    res.render('book', {title: 'Book', book: book, id: id});
    next()
});
router.get("*", (req, res)=>{
    res.status(404);
    res.end("Page not found");
});
module.exports = router;