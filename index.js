const express= require('express')
const path=require('path')
const app =express();
const mongoose =require('mongoose')
const userRouter=require('./routes/users')
app.use(express.urlencoded({extended:false}))
mongoose.connect('mongodb://localhost:27017/blogsite3').then(e=>console.log('mongoDB connected'));
PORT=8000;
app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/user/signup',(req,res)=>{
    res.render('signup')
})
app.get('/user/signin',(req,res)=>{
    res.render('signin')
})

app.use('/user',userRouter)
app.listen(PORT,()=>console.log(`server started at ${PORT}`))
