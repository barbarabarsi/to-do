import db from "../database/index.js"

class ItemController{
    async index(req, res){ 
        return res.json({item: "rota para itens"})
    }
}

export default new ItemController()