import React, {useContext, useEffect, useState} from "react";
import "./style.css"
import { AuthContext } from "../../context/auth";
import { getUsuario, api} from "../../services/api";

    
const Navbar = () => {

    const { usuario, logout } = useContext(AuthContext)
    const [usuarioLog, setUsuarioLog] = useState({})


    const loadUser = async() => {
        const response = await getUsuario(usuario?.ID)
        setUsuarioLog(response.data[0])
    }

    useEffect(() =>{
        (async () =>await loadUser())() 
    }, [])

    return(
        <div id="header">
            <p id="logo">Listas</p>
            <div>
                <p>Olá, {usuarioLog.Nome}!</p>
                <p id="logout" onClick={ logout}>Sair</p>
            </div>
            
        </div>
    )
}

export default Navbar