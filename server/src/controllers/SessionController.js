import jwt  from "jsonwebtoken"
import db from "../database/index.js"
import config from "../middleware/config.js"
import bcrypt from "bcryptjs"

class SessionController{
    async create(req, res){
        const { Email, Senha } = req.body
        db.pool.execute('SELECT * from Usuario WHERE Email = ?',  [Email], (error, results) => {      
            if (error) return res.status(500).json({ error: "Internal server error." })
            if(Object.keys(results).length === 0) return res.status(401).json({ error: "Email e/ou senha inválidos." })
 
            const ID = results[0].ID

            bcrypt.compare(Senha, results[0].Senha).then( (match) => {
                if(!match) return res.status(401).json({ error: "Email e/ou senha inválidos." })    

                return res.status(200).json({
                    ID: ID,
                    token: jwt.sign({ ID }, config.secret,{
                        expiresIn: config.expiresIn
                    })
                })
            })
        })
    }
}

export default new SessionController()