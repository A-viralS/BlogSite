const {Router}=require('express');

const multer=require('multer')
const path= require('path');
const Blog=require('../models/blog')
const router=Router();

const { log } = require('console');
const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb (null, fileName);
    }, 
    });

const upload=multer({storage:storage})
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
      user: req.user,
    });
  });

  router.post("/", upload.single("coverImageURL"), async(req,res)=>{
 const {title,body}=req.body;
 console.log(req.file);
 const blog=await Blog.create({
    title,
    body,
    coverImageURL:`/uploads/${req.file.filename}`,//because the file is saved at that path so we need to put the path itself to get the file to be saved 
    createdBy:req.user._id,

 })
  
  return res.redirect(`/blog/${blog._id}`)

  })
module.exports=router;

