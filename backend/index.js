const express = require("express");

const { prodRouter } = require("./routes/prodRoutes");
const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send({msg : "Base Route"})
})

app.post("/signup", (req, res)=>{
    const {name, email, password} = req.body;
   
        bcrypt.hash(password, 3, async function(err, hash){
            if(err){
                res.send({msg : "something went wrong"})
            }else{
                const new_user = new UserModel({
                    name,
                    email,
                    password : hash
                })
                try {
                    await new_user.save()
                    res.status(200).send({msg : "Signup Successful"})
                } catch (error) {
                    res.send({msg : "Signup failed"})
                }
            }
        })
})

app.post("/login", async (req, res)=>{
    const {email, password} = req.body;

    const user = await UserModel.findOne({email : email});
    const hashed_password = user.password;

    bcrypt.compare(password, hashed_password, function(err, result){
        if(err){
            res.send({msg : "Login Failed, wrong credentials!"})
        }else{
            const token = jwt.sign({user_id : user._id}, process.env.SECRET_KEY);
            res.status(200).send({msg : "Login Successful", token : token});
        }
    })
})

app.use("/prods" , prodRouter);

app.listen(8080, async ()=>{
    try{
        await connection
        console.log("Connected to DB successfully")
    }catch(err){
        console.log("Error connecting to DB")
        console.log(err)
    }
    console.log("Listening on port 8080");
})