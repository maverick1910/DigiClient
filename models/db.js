const mongoose=require('mongoose');


const Schema=mongoose.Schema;
const blogSchema= new Schema({
    
     title:String,
    content:String
       
    // client:{
    //     title:String,
    //     content:String,
    //     date:Date.now()
    // }
    
});

const blog =mongoose.model('blog', blogSchema);

module.exports =blog;