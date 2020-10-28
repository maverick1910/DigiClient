if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose=require('mongoose');
const blog= require('./models/db');

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs'); 
var path = require('path'); 
const MONGODB_URI="" // ADD YOUR CONNECTION STRING HERE


mongoose.connect('mongodb://localhost:27017/gfg' /*Replace this with your local database*/ ||MONGODB_URI ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected', () =>{
    console.log('Mongoose is connected');
});

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
const hash = bcrypt.hashSync(process.env.PASSWORD, 10);
const users = []
users.push({
  id: Date.now().toString(),
  name: process.env.NAME,
  email: process.env.EMAIL,
  password: hash,
});


app.set("view engine", "ejs");
app.use('*/css', express.static('public/css'));
app.use('*/js', express.static('public/js'));
app.use('*/img', express.static('public/img'));
app.use('*/fonts', express.static('public/fonts'));
app.use('*/scss', express.static('public/scss'));
app.use('*/vendors', express.static('public/vendors'));

app.use(express.urlencoded({ extended: false }))


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
app.get('/single-blog',function(req,res){
    res.render('single-blog');
});

//Please create a page where the user can add a blog naming it as admin 
// Blog 
// '/admin' is the route to create your blog
app.get('/blog', (req ,res)=>{

  blog.find({ })
      .then((data)=>{
        
        res.render('blog.ejs',{blog:data});
          console.log(data);
         
         
         
      })
      
      .catch((error)=>{
          console.log("Error receiving data from database",error);
      })  
});


app.get('/contact',function(req,res){
    res.render('contact');
});
//Admin Authentication
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
//Page to create your blog
app.get('/admin', checkAuthenticated, (req, res) => {
  res.render('ad_index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true
}))


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin')
  }
  next()
}


// app.post('/blog',(req,res)=>{
//   const data={
//        title:req.body.title,
//     content:req.body.content,
    
    
//   }
//   console.log(req.body)
  
//   const newblog= new blog(data);
//   newblog.save((error)=>{
//       if(error){
//           res.status(500).json({msg:"Server Error"});
//       }
//       else{   res.redirect('/admin');
//       ;
//   }
//   })
// })

   

   var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage }); 

app.post('/blog', upload.single('image'), (req, res, next) => { 
  
  var data = { 
      title: req.body.title, 
      content: req.body.content, 
      img: { 
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
          contentType: 'image/png'
      } ,
      author: req.body.author,
      category:req.body.category,
      date:{day:req.body.day,
      month:req.body.month,
    year:req.body.year},
  } 
  const newblog= new blog(data);
  newblog.save((error)=>{
      if(error){
          res.status(500).json({msg:"Server Error"});
      }
      else{   res.redirect('/admin');
      ;
  }
  })
 
}); 


app.listen(3000,console.log('server up'));


