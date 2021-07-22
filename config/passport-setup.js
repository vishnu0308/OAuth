const passport= require('passport');
const mongoose=require('mongoose');
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/userschema')

passport.serializeUser((user,done)=>{
  done(null,user.id)
});


passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user)
  });
});

passport.use(new GoogleStrategy({
    clientID: 
    'xyz',
    clientSecret: "xyz",
    callbackURL: "http://localhost:4444/auth"
    },
    (accessToken,refreshToken,profile,done)=>{
        console.log(profile);
        // console.log(profile.photos[0].value)
        const data=new User({
            Name:profile.displayName,
            Mail_Id:profile.emails[0].value,
            user_profile:profile.photos[0].value
        })
        async function  createorfind(){
            const finduser= await User.findOne({Mail_id:data.Mail_id})
            if(finduser==null){ 
                const result=await data.save();
                // console.log(result)
                done(null,result)
              }else{
                // console.log("finduser is :",finduser);
                done(null,finduser)
            }
        }
        createorfind();
}  
));

