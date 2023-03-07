import db from "../database/index.js"

class ToDoController{
    async index(req, res){ 
        return res.json({todo: "rota para todos"})
    }
}

export default new ToDoController()