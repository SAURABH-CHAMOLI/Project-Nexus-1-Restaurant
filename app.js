const express=require("express")
const app=express();
const mongoose=require("mongoose")
const path=require("path")
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))

const passport=require("passport")
const LocalStrategy=require("passport-local");

const User=require("./models/user.js")

passport.use(new LocalStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());    
passport.deserializeUser(User.deserializeUser());

const session=require("express-session");
app.use(session({
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}))

app.use(passport.initialize());  
app.use(passport.session());

const flash=require("connect-flash");
app.use(flash())


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


let port=8080;

main()
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/restaurant')
}




app.get("/main",(req,res)=>{
    res.render("index.ejs")
})


//Render signup
app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})

//Post signup
app.post("/signup",async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({username,email})
    const registeredUser=await User.register(newUser,password)
    console.log(registeredUser)
    res.redirect("/main")
})

//Render login
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

//Post login
app.post("/login",
passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),  
async (req,res)=>{
    res.redirect("/main")
})

//Logout
app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/main")
    })
})



app.get('/',(req,res)=>{
    res.send("Let's Start the Project")
})
app.listen(port,(req,res)=>{
    console.log(`listening to port:${port}`)
})