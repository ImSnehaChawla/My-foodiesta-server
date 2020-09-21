const express = require("express")
const app = express() //created new express app
const mongoose = require("mongoose")
const {mongoURI} = require("./keys")
const PORT = 5000

mongoose.connect(mongoURI,{useNewUrlParser:true,useUnifiedTopology:true }) //connected with database

mongoose.connection.on("connected",() => {
    console.log("connected to mongoDB successfully")
})
mongoose.connection.on("error",(error) => {
    console.log("error"+error+" received while connecting to mongoDB")
})

require("./models/user")
require("./models/post")

app.use(express.json()) //parse all incoming req/data into json
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

// app.get("/", (req,res) => res.send("Hi There!")) //created new route user is making on this route

app.listen(PORT, () => console.log("server listening at" ,PORT)) //starting an http server on 5000