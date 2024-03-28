const express = require('express')
const router = express.Router()
const User = require("../models/User")

//creating new user by post method, doesn't require auth
router.post('/', (req,res)=>{
     console.log(req.body)
     const user = User(req.body)
     user.save()
     res.send(req.body)
})

module.exports = router