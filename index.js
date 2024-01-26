const express= require('express')
const path=require('path')
const app =express();
const mongoose =require('mongoose')
const userRouter=require('./routes/users');
const blogRouter=require('./routes/blog')
const Blog=require('./models/blog')
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const cookieParser=parser=require('cookie-parser')
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));
mongoose.connect('mongodb://localhost:27017/blogsite3').then(e=>console.log('mongoDB connected'));
PORT=8000;
app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    })
})
app.get('/user/signup',(req,res)=>{
    res.render('signup')
})
app.get('/user/signin',(req,res)=>{
    res.render('signin')
})
app.use('/blog',blogRouter)

app.use('/user',userRouter)
app.listen(PORT,()=>console.log(`server started at ${PORT}`))
