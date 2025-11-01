const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/user.model')



router.post('/register', async(req, res) => {
    
  try {
    const {username, email , password} = req.body

    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:"User already exists"})

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({username, email, password:hashedPassword})
    await newUser.save()

    res.json({message:"User registered successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal server error"})
  }
})


router.post('/login', async(req, res) => {

   try {
     const {email , password} = req.body

    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message:"Invalid Credentials"})

    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({message:"Invalid Credentials"})

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET  , {expiresIn:"1h"})

    const {password:kd, ...userData} = user._doc

    res.json({message:"Login Successful", token, user: userData})
   } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
   }
})




module.exports = router