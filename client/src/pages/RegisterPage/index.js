import React, { useState, useContext } from "react";
import "../LoginPage/style.css"
import { AuthContext } from "../../context/auth";
import { createUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom"

const RegisterPage = () => {
    
    const navigate = useNavigate();
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const { login } = useContext(AuthContext)

    const handleCreate = async() => {
        await createUser({Nome:nome, Email:email, Senha:senha})
        await login(email,senha)
        navigate("/")
    }

    return(
        <div id="login">
            <form>
                <div className="title">Cadastre-se</div>
                <input 
                type="text" 
                name="nome" 
                id="nome" 
                placeholder="Nome"
                value = { nome }
                onChange = { (e) => setNome(e.target.value)}
                />
                <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Email"
                value = { email }
                onChange = { (e) => setEmail(e.target.value)}
                />
                <input 
                type="password" 
                name="senha" 
                id="senha" 
                placeholder="Senha"
                value = { senha }
                onChange = { (e) => setSenha(e.target.value)}
                />
                <button type="button" onClick={ handleCreate }>Cadastrar</button>
                <span>Já possui uma conta? <Link to="/login">Faça seu login</Link> </span>
            </form>                
        </div>
    )
}

export default RegisterPage