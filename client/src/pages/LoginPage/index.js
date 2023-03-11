import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/auth";
import "./style.css"

const LoginPage = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const handleLogin = async() => {
        await login(email,senha)
        navigate("/")
    }

    return(
        <div id="login">
            <form>      
                <span className="title">Login</span>
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
                <button type="button" onClick={ () => handleLogin() }>Entrar</button>
                <span>Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se aqui</Link> </span>
            </form>
        </div>
    )
}

export default LoginPage