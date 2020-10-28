const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
var request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use('*/css', express.static('public/css'));
app.use('*/js', express.static('public/js'));
app.use('*/img', express.static('public/img'));
app.use('*/fonts', express.static('public/fonts'));
app.use('*/scss', express.static('public/scss'));
app.use('*/vendors', express.static('public/vendors'));


app.get('/',function(req,res){
    res.render('index');
});

app.get('/about-us',function(req,res){
    res.render('about-us');
});
app.get('/service',function(req,res){
    res.render('service');
});
app.get('/portfolio',function(req,res){
    res.render('portfolio');
});
app.get('/blog',function(req,res){
    res.render('blog');
});
app.get('/single-blog',function(req,res){
    res.render('single-blog');
});

//Please create a page where the user can add a blog naming it as admin 

app.get('/contact',function(req,res){
    res.render('contact');
});

app.listen(3000,console.log('server up'));


