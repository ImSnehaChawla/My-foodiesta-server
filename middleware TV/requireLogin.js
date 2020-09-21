const { jwtToken } = require("../keys")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports= (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
    return res.status(401).json({error:"you must be logged in"})
        
    }
    //if authorization header is present then we will retrieve token from it
   const token =  authorization.replace("Bearer ","")
    //authorization will be basically string like Bearer token having something Bearer .
    jwt.verify(token,jwtToken,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })
        // next() to stop middleware and to continue further
    })
    //now verify that token is same as that we have given and we will get a callback with err and payload
}