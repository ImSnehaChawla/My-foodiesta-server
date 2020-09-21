const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware TV/requireLogin')
const User = mongoose.model("User")
const Post = mongoose.model("Post")

router.post('/createpost',requireLogin, (req,res)=>{
    const {title,body} = req.body
    if(!title){
       return res.status(422).json({error:"Please add a title"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password=undefined //bcz we dont want to show password to user
    const post=new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router