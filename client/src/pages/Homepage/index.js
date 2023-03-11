import React from "react"
import { useState, useEffect, useContext } from "react"
import { api, getToDos, getCountItens, getItensTodo, checkItem, deleteItem, deleteToDo, createItem, createNewToDo, editToDo, getCategoria } from "../../services/api"
import { AuthContext } from "../../context/auth.js"
import "./style.css"
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import Navbar from "../Navbar"

const Homepage = () => {
    
    const { usuario } = useContext(AuthContext) 
 
    const [toDos, setToDos] = useState([])
    const [categoria, setCategoria] = useState([])
    const [porcToDos, setPorcToDos] = useState([])

    const [toDoNovo, setToDoNovo] = useState({Nome:'', Categoria:''})
    const [toDoSelected, setToDoSelected] = useState({})
    const [toDoEdit, setToDoEdit] = useState({Nome:toDoSelected.Nome, Categoria:toDoSelected.Categoria})
    const [toDoBusca, setToDoBusca] = useState({Nome:'', Categoria:''})
    
    const [comand, setComand] = useState('')
    const [popup, setPopup] = useState(false)

    const [itensToDo, setItensToDo] = useState([])
    const [itemNovo, setItemNovo] = useState('')

    const [alterarTodo, setAlterarTodo] = useState(false)
    const [inserirItem, setInserirItem] = useState(false)
    const [delToDo, setDelToDo] = useState(false)


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

    const sendItemNovo = async() => {
        await createItem(usuario?.ID,toDoSelected.ID, itemNovo)
        loadItens(toDoSelected)
        setInserirItem(false)
    }

    const handleCheck = async (itemID,conc) => {
        await checkItem(usuario?.ID,toDoSelected.ID,itemID,conc? 1 :0)
        const response = await getItensTodo(usuario?.ID,toDoSelected.ID)
        setItensToDo(response.data)
        loadPorcToDos()
    }
   
    const handleDelItem = async (itemID) => {
        await deleteItem(usuario?.ID,toDoSelected.ID,itemID)
        loadItens(toDoSelected)
    }

    const handleDelToDo = async (toDo) => {
        await deleteToDo(usuario?.ID,toDo)
        setDelToDo(false)
        setPopup(false)
    }

    const sendToDoNovo = async () => {

        let postResponse = {}
        if (toDoNovo.Nome === '' && toDoNovo.Categoria === '') postResponse = await createNewToDo(usuario?.ID, {Nome: "Sem título", Categoria: "Sem categoria"})
        else if (toDoNovo.Nome === '') postResponse = await createNewToDo(usuario?.ID, {Nome: "Sem título", Categoria: toDoNovo.Categoria})
        else if (toDoNovo.Categoria === '') postResponse = await createNewToDo(usuario?.ID, {Nome: toDoNovo.Nome, Categoria: "Sem categoria"})
        else postResponse = await createNewToDo(usuario?.ID, toDoNovo)

        const getResponse = await getToDos(usuario?.ID, postResponse.data.ID) 

        await loadItens(getResponse.data[0])
        setToDoSelected(getResponse.data[0])
        setComand("view")
        setInserirItem(true)
        setToDoNovo({Nome: '', Categoria: ''})
    } 

    const handlePopup = (comand) => {
        setComand(comand)
        setPopup(true)
    }

    const handleToDoEdit = async (toDoEdit) => {

        if (toDoEdit.Nome === undefined && toDoEdit.Categoria === undefined){
            await editToDo(usuario?.ID, toDoSelected.ID, {Nome: toDoSelected.Nome, Categoria: toDoSelected.Categoria})
        }
        else if (toDoEdit.Nome === undefined){
            await editToDo(usuario?.ID, toDoSelected.ID, {Nome: toDoSelected.Nome, Categoria: toDoEdit.Categoria})
        }
        else if (toDoEdit.Categoria === undefined){
            await editToDo(usuario?.ID, toDoSelected.ID, {Nome: toDoEdit.Nome, Categoria: toDoSelected.Categoria})
        } 
        else{
            await editToDo(usuario?.ID,toDoSelected.ID, toDoEdit)
        } 
        setAlterarTodo(false)
        const response = await getToDos(usuario?.ID,toDoSelected.ID)
        setToDoSelected(response.data[0])
        setToDoEdit({})
    }

    const handleSend = async (e) => {
        if (e.key === 'Enter' && itemNovo !== ''){
            sendItemNovo()
            setItemNovo('')
        } 
        else if (e.key === 'Enter' && itemNovo === '') setInserirItem(false)
    }

    useEffect(() =>{
        (async () =>{
            await loadToDos(toDoBusca)
            await loadCategorias()
        })()
    }, [porcToDos, toDoSelected])

    
    return(
        <div id="home">
            { popup && 
            <div className="popup">
                <div id="cover" onClick={() =>{
                    setAlterarTodo(false)
                    setPopup(false)
                    setItemNovo('')
                    setInserirItem(false)
                }}/>
                {
                    (comand==="create") ? 
                    <div className="create">
                        <p>Criar nova lista</p>
                            <input
                            type="text"
                            name= "toDoNome"
                            value={toDoNovo.Nome}
                            placeholder="Título"
                            onChange = { (e) => setToDoNovo( (prev) => ({...prev, Nome: e.target.value}) ) }
                            maxLength={50}
                            />
                            <div>
                                <CreatableSelect
                                    id="select"
                                    isClearable={false}
                                    formatCreateLabel={input => `Criar categoria "${input}"`}
                                    options={categoria}
                                    value = { 
                                        categoria.find((option) => option.value === toDoNovo.Categoria)
                                    }
                                    placeholder="Categoria"
                                    onChange = { (e) => setToDoNovo( (prev) => ({...prev, Categoria: e.value}))}
                                >
                                </CreatableSelect> 
                                <button onClick={() => sendToDoNovo()}>Criar</button>
                            </div>
                    </div> 
                    :
                    <div className="view"> 
                        {alterarTodo ?
                        <div className="info">
                            <input
                            type="text"
                            name= "toDoNome"
                            defaultValue={toDoSelected.Nome}
                            value = {toDoEdit.Nome}
                            onChange = { (e) => setToDoEdit( (prev) => ({...prev, Nome: e.target.value}) ) }
                            />
                            <CreatableSelect
                                id="select"
                                isClearable={false}
                                formatCreateLabel={input => `Criar categoria "${input}"`}
                                options={categoria}
                                placeholder={toDoSelected.Categoria}
                                value = { 
                                    categoria.find((option) => option.value === toDoNovo.Categoria)
                                }
                                onChange = { (e) => setToDoEdit( (prev) => ({...prev, Categoria: e.value}))}
                            >
                            </CreatableSelect>       
                        </div>
                        :
                        <div className="info">
                            <p id="toDoNome">{toDoSelected.Nome}</p>
                            <p id="toDoCategoria">{toDoSelected.Categoria}</p>
                        </div>
                        }
                        <div className="content">
                            <ul id="itens">   
                                { itensToDo.map((item)=>
                                    <li key={item.ID}>
                                        <div>
                                            <input
                                            type="checkbox"
                                            id="item"
                                            name= "item"
                                            value={item.Concluido}
                                            defaultChecked={item.Concluido}
                                            onChange={() => handleCheck(item.ID, !item.Concluido) }
                                            />
                                            <span htmlFor={item.ID}>{item.Descricao}</span>
                                        </div>
                                        <button onClick={() => handleDelItem(item.ID)}>X</button>
                                    </li> 
                                )}
                                { inserirItem?
                                    <>
                                        <textarea
                                        id="itemNovo"
                                        name="itemNovo"
                                        value={itemNovo}
                                        placeholder="Novo item"
                                        onChange = { (e) => setItemNovo(e.target.value)}
                                        onKeyDown={handleSend} 
                                        maxLength="140"
                                        autoFocus
                                        />
                                        <div id="insert">
                                            <button className="default-button" id="insert-btn" onClick={() => {
                                                setItemNovo('')
                                                sendItemNovo()}
                                            }>Adicionar</button>
                                            <button className="default-button" id="insert-btn" onClick={() => {
                                                setItemNovo('')
                                                setInserirItem(false)
                                            }}>Cancelar</button>
                                        </div>
                                    </>
                                    :
                                    <button className="default-button" id="no-insert" onClick={() => setInserirItem(true)}>Adicionar item</button>
                                } 
                            </ul>
                            <div id="tools">
                                { porcToDos.filter(item => item.toDoID === toDoSelected.ID)[0]?.totalItens === 0?
                                    <p>Nenhum item inserido</p>
                                    :
                                    <p> { porcToDos.filter(item => item.toDoID === toDoSelected.ID)[0]?.itensConc}/  
                                        { porcToDos.filter(item => item.toDoID === toDoSelected.ID)[0]?.totalItens }&nbsp;itens concluídos&nbsp;
                                        <br></br>({porcToDos.filter(item => item.toDoID === toDoSelected.ID)[0]?.porc}%)
                                    </p>
                                }
                                { alterarTodo ?
                                    <button id="send" onClick={() => handleToDoEdit(toDoEdit)}>Enviar alterações</button> 
                                    :
                                    <button className="default-button" onClick={() => setAlterarTodo(true)}>Alterar lista</button>
                                }
                                <button id="delete-button" onClick={() => setDelToDo(true) }>Deletar</button>
                            </div> 
                        </div>                     
                </div> 
                }       
                {
                    delToDo && 
                    <div className="popup" id="del">
                        <div id="cover" onClick={ () => setDelToDo(false)}/>
                        <div className="delete">
                            <p> Deseja deletar a lista { toDoSelected.Nome } e os seus { 
                                porcToDos.filter(item => item.toDoID === toDoSelected)[0]?.totalItens
                                }
                                itens?
                            </p>
                            <button className="default-button" onClick={ () => setDelToDo(false) }>Cancelar</button>
                            <button  id="delete-button" onClick={ () => handleDelToDo(toDoSelected.ID) }>Deletar</button>
                        </div>
                    </div>
                }
                </div>
            }
            <Navbar/>
            <div id="sobescrito">
                <input
                type="text"
                id="toDoNomeBusca"
                name= "toDoNomeBusca"
                value={toDoBusca.Nome}
                placeholder="Título"
                onChange = { (e) => setToDoBusca( (prev) => ({...prev, Nome: e.target.value}) ) }
                />
                <Select options={categoria} 
                styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      zIndex: "1"
                    }),
                  }}
                id="select"
                placeholder="Categorias"
                value = { categoria.find((option) => option.value === toDoBusca.Categoria)}
                onChange = { (e) => setToDoBusca( (prev) => ({...prev, Categoria: e.value}) ) }>
                </Select>
                <button className="default-button" onClick={() => setToDoBusca({Nome:'', Categoria:''})}>Limpar filtros</button>
            </div>
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

