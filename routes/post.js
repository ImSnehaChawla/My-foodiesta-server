const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware TV/requireLogin')
const User = mongoose.model("User")
const Post = mongoose.model("Post")

router.get('/allposts',(req,res) => {
    Post.find() //we find without any condition bczwe want all posts
    .populate('postedBy','_id username') // bcz we wanyt all the details of the user that posed it
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/createpost',requireLogin, (req,res)=>{
    const {title,caption,photo} = req.body
    if(!title){
       return res.status(422).json({error:"Please add a title"})
    }
    if(!photo){
        return res.status(422).json({error:"Please add a photo"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password=undefined //bcz we dont want to show password to user
    const post=new Post({
        title,
        caption,
        photo,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res) => {
    Post.find({postedBy:req.user._id})
    .populate('PostedBy','_id username')
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})

module.exports = router