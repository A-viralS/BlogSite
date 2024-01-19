const {Router}= require('express')
const router =Router();
const User=require('../models/users')
router.get('/signup',(req,res)=>{
   return  res.render('signup')
})

router.get('/signin',(req,res)=>{
    return  res.render('signin')
 })
 router.post('/signup', async(req,res)=>{
    const {fullName, email, password}= req.body;
await User.create({
    fullName,
    email,
    password
});
return res.redirect('/')
 })

 router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
   const user=await User.matchPassword(email,password);
   console.log("User",user);
   res.redirect('/')
  });




module.exports= router;
