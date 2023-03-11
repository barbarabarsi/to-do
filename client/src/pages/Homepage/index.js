import React from "react"
import { useState, useEffect, useContext } from "react"
import { api, getToDos, getCountItens, getItensTodo, checkItem, deleteItem, deleteToDo, createItem, createNewToDo, editToDo, getCategoria } from "../../services/api"
import { AuthContext } from "../../context/auth.js"
import "./style.css"
const Homepage = () => {
    
    const { usuario } = useContext(AuthContext) 
 
    const [toDos, setToDos] = useState([])
    const [categoria, setCategoria] = useState([])
    const [porcToDos, setPorcToDos] = useState([])

    const [toDoSelected, setToDoSelected] = useState({})
    const [toDoBusca, setToDoBusca] = useState({Nome:'', Categoria:''})
    
    const [comand, setComand] = useState('')
    const [popup, setPopup] = useState(false)

    const [itensToDo, setItensToDo] = useState([])


    const loadToDos = async (toDo) => {
        const response = await getToDos(usuario?.ID,toDo)
        setToDos(response.data)   
        loadPorcToDos()   
        loadCategorias()
    }

    const loadCategorias = async () => {
        const response = await getCategoria(usuario?.ID)
        const options = []
        response.data.map((cat)=>
            options.push({
                value: cat.Categoria,
                label: cat.Categoria
            })
        )
        setCategoria(options)
    }

    const loadPorcToDos =  async () => {
        const response = await getCountItens(usuario?.ID)
        const porc = []
        response.data.map((item) => 
            porc.push({
                toDoID: item.todoID,
                itensConc: Number(item.itensConc),
                totalItens: item.totalItens, 
                porc: item.totalItens === 0 ? 0 : Math.floor((Number(item.itensConc)/item.totalItens)*100)
            })
        )
        setPorcToDos(porc)
    }

    const loadItens = async (toDo) => {
        loadPorcToDos()
        setToDoSelected(toDo)
        const response = await getItensTodo(usuario?.ID,toDo.ID)
        setItensToDo(response.data)
        handlePopup("view")
    }

    const handlePopup = (comand) => {
        setComand(comand)
        setPopup(true)
    }

    
    useEffect(() =>{
        (async () =>{
            await loadToDos(toDoBusca)
            await loadCategorias()
        })()
    }, [porcToDos, toDoSelected])

    
    return(
        <div id="home">
            <div id="header"></div>
            <div id="sobescrito"></div>
            <ul id="painel">
                {
                toDos?.map((toDo) => 
                    <button id="to-do" onClick={ () => loadItens(toDo) } key={toDo.ID}>
                        {
                        porcToDos.filter(item => item.toDoID === toDo.ID)[0]?.totalItens  === 0?
                        <p>Lista vazia</p>
                        :
                        <p> { porcToDos.filter(item => item.toDoID === toDo.ID)[0]?.porc }% concluído</p>
                        }
                        <p>{ toDo.Categoria }</p>
                        <p id="titulo">{ toDo.Nome }</p>
                    </button>
                )
                }  
                <button id="add" onClick={ () => handlePopup("create") }>
                    <p>+</p>
                </button>         
            </ul>
        </div>
    )
}

export default Homepage

