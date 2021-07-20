const express=require('express');
const app=express();
const passport=require('passport')
const loginroute= require('./routes/route');

const passportSetup=require('./config/passport-setup')
const mongoose=require('mongoose')
const cookieSession = require('cookie-session')

mongoose.connect('mongodb://localhost/userdata',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log('connecting with mongodb........'))
.catch(err => console.error('could not connect to mongo db',err))


// const loggedin=(req, res ,next) =>{
//     console.log("user is",req.user);
//     if(req.user==null){
//         console.log(req.user)
//         res.render('login')
//     }else{
//         next();
//     }
// }

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/login',loginroute);


app.use(cookieSession({
    maxAge:60*1000,
    keys:["abcdefghijklmopqrstuvwxyz"]
}))

app.use(passport.initialize());
app.use(passport.session());

const ensureAuth = (req, res, next)=> { 
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureGuest= (req, res, next) =>{ 
    if (req.isAuthenticated()) {
        res.redirect('/home')
    } else {
        return next()
    }
}

app.get('/',ensureGuest,(req,res)=>{
    res.redirect('/login')
})


app.get('/login',ensureGuest,(req,res)=>{
    res.render('login');
})


app.get('/auth',passport.authenticate('google'),(req,res)=>{
    console.log( "app user",req.user)
    res.redirect('/home');
})


app.get('/home',ensureAuth,(req,res)=>{
    console.log("req is:",req.user)
    res.render('index',{name:req.user.Name});
})


app.listen(4444,()=>{
    console.log("Listening on port 4444");
})

