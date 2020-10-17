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
const test=require('./models/testmon');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs'); 
var path = require('path'); 

mongoose.connect('mongodb://localhost:27017/gfg' ,{
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
  name: 'Jhon21',
  email: 'Jhon@gmail.com',
  password: hash,
});


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/admin', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
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

app.get('/', (req ,res)=>{
  var lists;
  blog.find({ })
      .then((data)=>{
          console.log(data);
        var blogs=data;
         
         
      })
      
      .catch((error)=>{
          console.log('error: ',error);
      })
      
  test.find({})
  .then((data)=>{
    console.log(data);
   lists=data;
})
.catch((error)=>{
    console.log('error: ',error);
})

      res.render('home.ejs',{blog:blogs,test:lists});
});

app.post('/blog',(req,res)=>{
  const data={
       title:req.body.content,
    content:req.body.content,
    
    
  }
  console.log(req.body)
  
  const newblog= new blog(data);
  newblog.save((error)=>{
      if(error){
          res.status(500).json({msg:"Server Error"});
      }
      else{   res.redirect('/admin');
      ;
  }
  })
})

   

   var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage }); 

app.post('/client', upload.single('image'), (req, res, next) => { 
  
  var data = { 
      title: req.body.content, 
      content: req.body.content, 
      img: { 
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
          contentType: 'image/png'
      } 
  } 
  const newtest= new test(data);
  newtest.save((error)=>{
      if(error){
          res.status(500).json({msg:"Server Error"});
      }
      else{   res.redirect('/admin');
      ;
  }
  })
 
}); 

app.listen(3000);