const express = require("express");
const app = express();
const passport = require("passport");
const loginroute = require("./routes/route");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
mongoose
  .connect(
    "mongodb+srv://summerproject:Red3NvFiYy4NAMr@cluster0.y1pwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("connecting with mongodb........"))
  .catch((err) => console.error("could not connect to mongo db", err));
app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const funcb = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
};

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  cookieSession({
    maxAge: 60 * 1000,
    keys: ["abcdefghijklmopqrstuvwxyz"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

const ensureAuth = (req, res, next) => {
  console.log("inside ensure auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("notloggedin");
  }
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    return next();
  }
};

app.get("/", ensureGuest, (req, res) => {
  res.redirect("/login");
});

app.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});

app.get(
  "/auth",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "/login",
  })
);

app.get("/home", ensureAuth, (req, res) => {
  // console.log("req is:",req.user)
  // res.render('index',{name:req.user.Name});
  res.send({ mail: "jhde@iitgoa.ac.in" });
});

app.get("/allowcors", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send("hi");
});

app.get("/checkauth", ensureAuth, (req, res) => {
  res.sendStatus(200);
});

app.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// app.get("/Teamup", ensureAuth, (req, res) => {
//   res.redirect("http://localhost:3000/Teamup");
// });

// app.get('/login/auth',passport.authenticate('google'),(req,res)=>{
//     console.log( "router user",req.user)

//     res.redirect('/home');
// })
app.get("/teamup", ensureAuth, (req, res) => {
  res.send({
    role: "sde",
    company: "amazon",
  });
});

app.get("/internship", ensureAuth, (req, res) => {
  res.send({
    role: "sde",
    company: "amazon",
  });
});

app.listen(4444, () => {
  console.log("Listening on port 4444");
});
