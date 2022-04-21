const res = require("express/lib/response")
const jwt = require("jsonwebtoken")
require("dotenv")
const verifyToken =(req,res,next)=>
{
    const token = req.headers['authorization'].split(' ')[1]
    // console.log('token is',token)

    if(!token)
    {
        res.status(403).send("A token is required for authorization")
    }else{
        try{
            const decodedToken = jwt.verify(token,process.env.JWTPRIVATEKEY)
            req.user =decodedToken 
            next()
        }catch{
            res.json({status:"error",data:"Something went wrong"})
        }
    }
}
module.exports=verifyToken