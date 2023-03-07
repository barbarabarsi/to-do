import db from "../database/index.js"

class HelloController{
    async index(req, res){
        return res.json({hello: "opa"})
    }
    async teste(req, res){
        db.pool.query('SELECT * from Usuario', (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            } 
            res.status(200).json(results) 
        }) 
    }
    
}

export default new HelloController()