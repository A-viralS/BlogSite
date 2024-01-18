const express= require('express')
const path=require('path')
const app =express();
PORT=8000;
app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.get('/',(req,res)=>{
    res.render('home')
})
app.listen(PORT,()=>console.log(`server started at ${PORT}`))