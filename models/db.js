const mongoose=require('mongoose');


const Schema=mongoose.Schema;
const blogSchema= new Schema({
    
    
     title:String,
    content:String,
    img: { data: Buffer, contentType: String }, 
    author:String,
    category:String,
    date:{day:String,month:String,year:String}

  
});

const blog =mongoose.model('blog', blogSchema);

module.exports =blog;