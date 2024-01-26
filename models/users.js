const { createHmac, randomBytes } = require("crypto");
const mongoose =require('mongoose');
const { createTokenForUser } = require("../services/authentication");
const UserSchema=new mongoose.Schema({
    fullName: {
        type:String,
        required:true,
        unique:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default: '/defaultPic.png',
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }

},
{timestamps:true}
)

UserSchema.pre("save", function (next) {
    const user = this;
  
    if (!user.isModified("password")) return;
  
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");
  
    this.salt = salt;
    this.password = hashedPassword;
  
    next();
  });
  UserSchema.static(
    "matchPasswordAndGenerateToken",
    async function (email, password) {
      const user = await this.findOne({ email });
      if (!user) throw new Error("User not found!");
  
      const salt = user.salt;
      const hashedPassword = user.password;
  
      const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
  
      if (hashedPassword !== userProvidedHash)
        throw new Error("Incorrect Password");
  
   const token=createTokenForUser(user);
   return token;
    }
  );
  const User=mongoose.model("user",UserSchema);// user is the name of the collections. it would be shown as users in the terminal as mongo pluralises it 
  module.exports=User;