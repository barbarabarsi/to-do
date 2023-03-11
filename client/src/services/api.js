import axios from "axios"


export const api = axios.create({
    baseURL: 'http://localhost:5000',
})

export const createSession = async(email, senha) => {
    return api.post('/session', {'Email':email, 'Senha': senha })
}

export const getUsuario = async (ID) => {
    let url = `/usuario/${ID}`
    return api.get(url)
}

export const getToDos = async (ID,query) => {
    let url = `/usuario/${ID}/todo`
    if (query !== undefined && typeof(query) == 'string') url += `?id=${query}`
    else if (query !== undefined && typeof(query) == 'object') url += `?nome=${query.Nome}&categoria=${query.Categoria}`
    return api.get(url)
}

export const getCountItens = async (ID) => {
    let url = `/usuario/${ID}/itemcount`
    return api.get(url)
}

export const getItensTodo = async (ID,toDoID) => {
    let url = `/usuario/${ID}/todo/${toDoID}/itens`
    return api.get(url)
}

export const checkItem = async (ID,toDoID,itemID,conc) => {
    let url = `/usuario/${ID}/todo/${toDoID}/item/${itemID}`
    return api.patch(url, {'Concluido': conc})
}

export const deleteItem = async (ID,toDoID,itemID) => {
    let url = `/usuario/${ID}/todo/${toDoID}/item/${itemID}`
    return api.delete(url)
}

export const deleteToDo = async (ID,toDoID) => {
    let url = `/usuario/${ID}/todo/${toDoID}`
    return api.delete(url)
}

export const createItem = async (ID,toDoID,itemDesc) => {
    let url = `/usuario/${ID}/todo/${toDoID}/item`
    // if (query !== undefined) url += `?q=${query}`
    return api.post(url, {Descricao: itemDesc})
}

export const createNewToDo = async (ID,toDoNovo) => {
    let url = `/usuario/${ID}/todo`
    return api.post(url, {Nome: toDoNovo.Nome, Categoria: toDoNovo.Categoria})
}

export const editToDo = async (ID,toDoID,toDoEdit) => {
    let url = `/usuario/${ID}/todo/${toDoID}`
    return api.patch(url, {Nome: toDoEdit.Nome, Categoria: toDoEdit.Categoria})
}

export const getCategoria = async (ID) => {
    let url = `/usuario/${ID}/todoCat`
    return api.get(url)
}

export const createUser = async(usuarioNovo) => {
    let url = `/usuario/`
    return api.post(url,usuarioNovo)
}