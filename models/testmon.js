const mongoose=require('mongoose');


const Schema=mongoose.Schema;
const testSchema= new Schema({
    
    
        title:String,
        content:String,
        img: { data: Buffer, contentType: String },
        
   
    
});

const test =mongoose.model('test', testSchema);

module.exports =test;