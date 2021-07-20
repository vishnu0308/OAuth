const passport=require('passport');
const router=require('express').Router();
const express=require('express');
const app=express();
app.use(express.static('public'));


router.get('/google',passport.authenticate('google',{scope:['profile','email','contacts']}));




router.get('/auth',passport.authenticate('google'),(req,res)=>{
    console.log( "router user",req.user)
    res.redirect('/home');
})


module.exports= router;