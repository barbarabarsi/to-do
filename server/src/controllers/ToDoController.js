import db from "../database/index.js"
import { v4 as uuid } from 'uuid';
class ToDoController{

    // Exibe todos os "to do" de um usuário específico
    async index(req, res){

        const {UsuarioID} = req.params

        db.pool.execute('SELECT * from ToDo WHERE fk_Usuario_ID = ?', [UsuarioID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 

    // Cria um "to do"
    async create(req, res){

        const ID = uuid() 
        const {UsuarioID} = req.params
        const {Nome, Categoria} = req.body

        db.pool.execute('INSERT INTO ToDo VALUES (?,?,?,0,?)', [ID, Nome, Categoria, UsuarioID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 

    // Deleta um "to do" a partir do seu ID
    async delete(req, res){

        const { ID } = req.params
        
        db.pool.execute('SELECT * from ToDo WHERE ID = ?',  [ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            } 
        
            if(Object.keys(results).length === 0) return res.status(404).json({ error: "Registro não existe no sistema." })
        
            db.pool.execute('DELETE FROM ToDo WHERE ID = ?',[ID],(error, results) => { 
                if(error) return res.status(500).json({ error: "Internal server error." })
                res.status(200).json(results)   
            })
        })
    } 

    // Atualiza os dados de um "to do"
    async update(req, res){

        const {Nome, Categoria, Concluido} = req.body
        const {ID} = req.params

        db.pool.execute('UPDATE ToDo SET Nome = ?, Categoria = ?, Concluido = ? WHERE ID = ?', [Nome, Categoria, Concluido, ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 
    
    //Atualiza o estado de um "to do"
    async updateState(req, res){
        
        const {Concluido} = req.body
        const {ID} = req.params
        console.log(Concluido,ID)
        db.pool.execute('UPDATE ToDo SET Concluido = ? WHERE ID = ?', [Concluido, ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })

    } 

    // Contabiliza os "to do" concluídos e totais
    async count(req, res){

        const {UsuarioID} = req.params

        db.pool.execute('SELECT COUNT(ID) AS TotalToDo, (SELECT COUNT(ID) FROM ToDo WHERE Concluido = 1 AND fk_Usuario_ID=?) AS ToDoConcluidos FROM ToDo WHERE fk_Usuario_ID=?', [UsuarioID,UsuarioID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 
}

export default new ToDoController()