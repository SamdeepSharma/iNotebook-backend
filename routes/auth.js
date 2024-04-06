const express = require('express')
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fetchuser = require('../middleware/fetchuser')

JWT_SECRET = 'Samdeep#isa$good$buoy'

//#ROUTE:1  creating new user by post method, doesn't require login
router.post('/createuser',
     [body('name', 'Enter a valid name').isLength({ min: 3 }),
     body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
     ], async (req, res) => {
          //If there are errors, return bad request
          const result = validationResult(req);
          if (!result.isEmpty()) {
               return res.json({ errors: result.array() });
          }
          try {

               //check if user with the same email exists already
               let user = await User.findOne({ email: req.body.email })
               if (user) {
                    res.status(400).json({ error: "Sorry, a user with this email already exists" })
               }

               const salt = await bcrypt.genSalt(10)
               const secPass = await bcrypt.hash(req.body.password, salt)
               user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass
               })

               const data = {
                    user: {
                         id: user.id
                    }
               }
               const authtoken = jwt.sign(data, JWT_SECRET)
               res.json({ "authtoken": authtoken })
          } catch (error) {
               console.log(error.message)
               // res.status(500).send("Something seems broken!")
          }
     })

//ROUTE: 2  authenticate a user using api/auth/login and creating login endpoint, no login required
router.post('/login', [
     body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password must be atleast 8 characters').exists()
], async (req, res) => {
     const result = validationResult(req);
     if (!result.isEmpty()) {
          return res.json({ errors: result.array() });
     }
     const {email, password} = req.body;
     try {

          //check if user with the same email exists already
          let user = await User.findOne({ email: req.body.email })
          if (!user) {
               res.status(400).json({ error: "Email and Password combination does not match" })
          }

          const passwordCompare = await bcrypt.compare(password, user.password)
          if(!passwordCompare)
          {
               return res.status(400).json({error: "Email and Password combination does not match"})
          }

          const data = {
               user: {
                    id: user.id
               }
          }
          const authtoken = jwt.sign(data, JWT_SECRET)
          res.json({ "authtoken": authtoken })
     } catch (error) {
          console.log(error.message)
          // res.status(500).send("Opps! Something seems broken.")
     }
})

//ROUTE: 3  To get logged in user's details using api/auth/getdata, login required
router.post('/getdata', fetchuser, async (req,res)=>{
     try{
          userId = req.user.id
          const user = await User.findById(userId).select("-password")
          res.send(user)
     }
     catch(error)
     {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

module.exports = router