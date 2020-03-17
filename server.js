const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var Alphabet = [
    {alpha:"A : Apple",image:"https://i.ytimg.com/vi/RTfvXkEXa-k/maxresdefault.jpg"},
    {alpha:"B : Ball",image:"https://i.ytimg.com/vi/XlUPuj2V6PM/maxresdefault.jpg"},
    {alpha:"C : Cat",image:"https://i.ytimg.com/vi/Haj9TAFCv5w/maxresdefault.jpg"},
    {alpha:"D : Dog",image:"https://i.ytimg.com/vi/XkTsdHlMXZM/maxresdefault.jpg"},
];

app.get("/",(req,res) =>{
    res.render("home");
});

app.get("/alphabets",(req,res) =>{
    res.render("alphabet",{Alpha:Alphabet});
});

app.post("/alphabets",(req,res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let newAlpha = {alpha: name, image: image}
    Alphabet.push(newAlpha);
    res.redirect("/alphabet");
});

app.get("/newalphabet",(req,res) =>{
    res.render("new");
});

app.listen(3000,()=>{
    console.log("server start on port 3000");
});