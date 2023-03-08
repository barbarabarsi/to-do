import db from "../database/index.js"
import { v4 as uuid } from 'uuid';

class ItemController{

    // Exibe todos os itens de um "to do"
    async index(req, res){

        const { ToDoID } = req.params

        db.pool.execute('SELECT * from Item WHERE fk_ToDo_ID = ?', [ToDoID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 

    // Cria um item em um "to do"
    async create(req, res){

        const { ToDoID } = req.params
        const { Descricao } = req.body
        const ID = uuid()

        db.pool.execute('INSERT INTO ToDo VALUES (?,0,?,?)', [ Descricao, ToDoID, ID ], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 

    // Deleta um item a partir do seu ID
    async delete(req, res){

        const { ID } = req.params
        
        db.pool.execute('SELECT * from Item WHERE ID = ?', [ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            } 
        
            if(Object.keys(results).length === 0) return res.status(404).json({ error: "Registro não existe no sistema." })
        
            db.pool.execute('DELETE FROM Item WHERE ID = ?',[ID],(error, results) => { 
                if(error) return res.status(500).json({ error: "Internal server error." })
                res.status(200).json(results)   
            })
        })
    } 

    // Atualiza os dados de um item
    async update(req, res){

        const { Descricao } = req.body
        const { ID } = req.params

        db.pool.execute('UPDATE Item SET Descricao = ? WHERE ID = ?', [Descricao, ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 
    
    //Atualiza o estado de um item
    async updateState(req, res){
        
        const {Concluido} = req.body
        const {ID} = req.params
        console.log(Concluido,ID)
        db.pool.execute('UPDATE Item SET Concluido = ? WHERE ID = ?', [Concluido, ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })

    } 

    // Contabiliza os itens totais e concluídos por ToDo
    async count(req, res){

        const {UsuarioID} = req.params

        db.pool.execute('SELECT Item.fk_ToDo_ID AS todoID, SUM(Item.Concluido) AS ItensConcluidos, COUNT(Item.ID) AS totalItens FROM Item INNER JOIN ToDo ON Item.fk_ToDo_ID = ToDo.ID WHERE fk_Usuario_ID = ? GROUP BY Item.fk_ToDo_ID',
         [UsuarioID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    } 
}

export default new ItemController()