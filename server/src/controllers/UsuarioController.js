import db from "../database/index.js"
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs'

// mostrar todos os dados de um usuário
// deletar um usuário
// alterar um usuário
// criar um usuário

class UsuarioController{

    async index(req, res){

        db.pool.execute('SELECT * from Usuario', (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })  
    }

    // Exibe um usuário de acordo com sua ID
    async show(req, res){

        const { ID } = req.params

        db.pool.execute('SELECT * from Usuario WHERE ID = ?',  [ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })  
    }

    // Cria um usuário, com nome, email e senha
    async create(req, res){

        const {Nome, Email} = req.body
        const hashSenha = await bcrypt.hash(req.body.Senha, 10) //Criptografando a senha tulizando bcrypt
        const ID = uuid()

        db.pool.execute('INSERT INTO Usuario VALUES (?,?,?,?)',  [Nome, Email, hashSenha, ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            }
            res.status(200).json(results)      
        })
    }

    // Deleta um usuário com uma ID específica
    async delete(req, res){
        const {ID} = req.params

        // Checagem da existência do usuário requisitado no banco de dados
        db.pool.execute('SELECT * from Usuario WHERE ID = ?',  [ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            } 
        
            if(Object.keys(results).length === 0) return res.status(404).json({ error: "O usuário não está cadastrado no sistema." })
        
            db.pool.execute('DELETE FROM Usuario WHERE ID = ?',[ID],(error, results) => { 
                if(error) return res.status(500).json({ error: "Internal server error." })
                res.status(200).json(results)   
            })
        })
    }

    // Atualiza usuários utilizando sua ID como referência
    async update(req, res){

        const {ID} = req.params
        const { Nome, Email, Senha} = req.body 

        // Checagem da existência do usuário requisitado no banco de dados
        db.pool.execute('SELECT * from Usuario WHERE ID = ?',  [ID], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ error: "Internal server error." })
            } 
            if(Object.keys(results).length === 0) return res.status(404).json({ error: "O usuário não está cadastrado no sistema." })
        
            db.pool.execute('UPDATE Usuario SET Nome = ?, Email = ?, Senha = ? WHERE ID = ?',[Nome, Email, Senha, ID],(error, results) => { 
                if(error) return res.status(500).json({ error: "Internal server error." })
                res.status(200).json(results)   
            })
        })
    }

}


export default new UsuarioController()

