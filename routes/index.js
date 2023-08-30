var express = require('express');
var router = express.Router();
var userModel=require('./users');
var productModel=require('./product')
const passport = require('passport');
const localStrategy = require('passport-local');
var multer=require('multer')
var path=require('path');
const product = require('./product');

passport.use(new localStrategy(userModel.authenticate()))
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
   var dt=new Date()
   var fn=Math.floor(Math.random()*10000)+dt.getTime()+path.extname(file.originalname)

    cb(null,fn)
  }
})

const upload = multer({ storage: storage })




router.get('/feed',isLoggedIn,async function(req,res,next){
  //who is logged in ----->
  // let user=req.session.passport.user
  const foundedUser=await userModel({username:req.session.passport.user})
    res.render("feed",{foundedUser})
 })


router.get('/', function(req, res, next) {
  res.render('index',);
});
router.post('/register',upload.single('image'),function(req,res,next){

  var createdUser=new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    image:req.file.filename

  })
  userModel.register(createdUser,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/')
      // console.log(req.file.filename)
    })
  })
})
router.get('/login',passport.authenticate('local',{
  successRedirect:'/feed',
  failureRedirect:'/'
}),function(req,res,next){})
router.get('/logout',function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get("/dashboard",isLoggedIn,isAdmin,async function(req,res,next){
  const foundedUser=await userModel({username:req.session.passport.user})
  // console.log(foundedUser)
  res.render("dashboard",{user:foundedUser})
})

// product creation route====>






// middlewares===>

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else res.redirect('/')
}

 async function isAdmin(req,res,next){
  const user= await userModel.findOne({username:req.session.passport.user})
  if(user.role==="admin"){
    next()
  }
  else{
    res.redirect('/feed')
  }

}

module.exports = router;
