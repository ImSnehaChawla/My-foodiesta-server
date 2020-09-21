const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {jwtToken} = require("../keys")
const requireLogin = require('../middleware TV/requireLogin')

//created a get route to test
// router.get("/",(req, res) => {
//     res.send("hey route is craeted")
// })

//created a protected route for token verification
// router.get("/protected",requireLogin, (req,res)=>{
//     res.send("welcome to protected route")
// })

//created a signup route
router.post("/signup",(req,res) => {
    const {username, email, password} = req.body
    if(!username || !email || !password){
       return res.status(422).json({error:"Please Fill all the fields"})
    }
    // res.json({message:"Successfully Posted"})
    User.findOne({email:email}) //hm find krre h user is user email k sth agr h to error dedia wrna data save krlia
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({
                error:"user already exists with this email id"
            })
        }
        bcrypt.hash(password,17)
        .then(hashedpassword =>{
            const user = new User({
                email,
                password:hashedpassword,
                username
            })
            user.save()
            .then(user => {
                res.json({
                    message:"saved successfully"
                })
            
                })
            .catch(err => {
                    console.log(err)
            })
        })
        .catch(err=>{
            console.log(err);
        })
        })
        
    .catch(err => {
        console.log(err)
    })
})

//created a signin route
router.post("/signin",(req,res)=>{
    const{email,password} = req.body //destructring from body
    if(!email || !password){
        res.status(422).json({error:"please fill the all fields"})

    }
    User.findOne({email:email})
    .then(savedUser => {            //savedUser contain all record like email username etc
        if(!savedUser){
            res.status(422).json({error:"Invalid ID or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(matched =>{
            if(matched){
            // res.json({
                // message:"successfully signed in"})
            const token = jwt.sign({_id:savedUser._id},jwtToken) //generating token on the basis on user id
            const {_id,username,email} = savedUser
            res.json({token, user:{_id,username,email}})
        }
            else{
                res.status(422).json({error:"Invalid ID or Password"})
 
            }
        })
        .catch(err =>{
            console.log(err) //if error is from dev side
        })

    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router