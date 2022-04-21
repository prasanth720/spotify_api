const express = require("express")
const {User,validate} = require('../models/userschema')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const res = require("express/lib/response");
require("dotenv")
const login_post =   async (req, res) => {
    const data = req.body
   await User.findOne({ email:data.email}).then((existUser) =>
        {
            // console.log('exist user',existUser)
            if(existUser && existUser._id)
            {
                bcrypt.compare(data.password,existUser.password,function(err,response){
                    if(!err)
                    {
                        if(response){
                          const authToken = jwt.sign({_id:existUser._id,email:existUser.email},process.env.JWTPRIVATEKEY,{
                               expiresIn :'19h'
                           })
                           res.status(200).json({data:{authToken, response,existUser}})
                        }else if (!response)
                        {
                            res.status(400).json({data:{existUser,response}})
                        }
                    }
                })
            }
        }).catch(err =>
            {
                res.status(500).json({status:err,data:"Something went wrong"})
            })
}

const get_all_logins = async (req,res)=>
{
    await User.find().then(data=>
        {
            res.status(200).json(data)
        })
}

module.exports.login_new_post = login_post
module.exports.get_logins =get_all_logins
// module.exports.get_signup_details=get_sign_details;