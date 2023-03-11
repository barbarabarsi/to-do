import jwt from "jsonwebtoken"
import { promisify } from "util"
import config from "./config.js"

export default async (req, res, next) => {
    
    const auth = req.headers.authorization
    if(!auth){
        return res.status(401).json({ error: "Token não foi fornecido" })
    } 
    const [ , token] = auth.split(' ')
    try{
        const decoded = await promisify(jwt.verify)(token, config.secret)
        req.ID = decoded.id
        return next()
    }
    catch(err){
        return res.status(401).json({ error: 'Token inválido.' })
    }

}