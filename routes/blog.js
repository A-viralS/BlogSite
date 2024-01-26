const {Router}=require('express');
const Comment=require('../models/comment')
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
  router.get('/:id',async(req,res)=>{

    
    const blog=await Blog.findById(req.params.id).populate("createdBy");//params.id is used when we want to get id from teh url // populate adds a new field in the blog const. this will we refered to the user as it is mentioned in the model. this is done to get the user image on the blog that he has created
    const comments = await Comment.find({ blogId: req.params.id }).populate(
        "createdBy"
      );
   
    return res.render('blog',{
blog,
user:req.user,
comments
    })
 })

 router.post('/comment/:blogId',async(req,res)=>{
    const {content}=req.body;
    await Comment.create({
content,
createdBy:req.user._id,
blogId:req.params.blogId
    })
    return res.redirect(`/blog/${req.params.blogId}`);
 })



module.exports=router;

