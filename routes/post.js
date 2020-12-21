const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware TV/requireLogin')
const User = mongoose.model("User")
const Post = mongoose.model("Post")

router.get('/allposts',requireLogin,(req,res) => {
    Post.find() //we find without any condition bczwe want all posts
    .populate('postedBy','_id username') // bcz we wanyt all the details of the user that posed it
    .populate("comments.postedBy","_id username")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})



router.post('/createpost',requireLogin, (req,res)=>{
    const {title,caption,photo,isVideo} = req.body
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
        isVideo,
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

router.put('/likes',requireLogin,(req,res) =>{
    
        
    Post.findOne({_id:req.body.postId}, function(error, rslt) {
        if(!rslt.likes.includes(req.user._id)){
            Post.findByIdAndUpdate(req.body.postId,{
    
                $push:{likes:req.user._id}
            },{
                new:true //taki mongodb updated record bheje
            }).exec((err,result) => {
                if(err){
                    return res.status(422).json({error:err})
                }
                else{
                    res.json(result)
                }
            })
        }
        else{
res.json(rslt.likes)
        }
    });
    
//     Post.findByIdAndUpdate(req.body.postId,{
    
//     $push:{likes:req.user._id}
// },{
//     new:true //taki mongodb updated record bheje
// }).exec((err,result) => {
//     if(err){
//         return res.status(422).json({error:err})
//     }
//     else{
//         res.json(result)
//     }
// })
})

router.put('/comments',requireLogin,(req,res) =>{
    const comment ={
        text :req.body.text,
        postedBy:req.user._id
        // postedBy:req.user.username
    }
        Post.findByIdAndUpdate(req.body.postId,{
    
                $push:{comments:comment}
            },{
                new:true //taki mongodb updated record bheje
            })
            .populate("comments.postedBy","_id username")
            .populate("postedBy","_id username")
            // console.log(postedBy)
            .exec((err,result) => {
                if(err){
                    return res.status(422).json({error:err})
                }
                else{
                    res.json(result)
                }
            })
        }
       
    );

    router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
        Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
             return res.status(422).json({error:err})   
            }
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
            }
        })
    })
module.exports = router