import { Router } from "express";

import HelloController from "./controllers/HelloController.js";
import UsuarioController from "./controllers/UsuarioController.js";
import ToDoController from "./controllers/ToDoController.js";
import ItemController from "./controllers/ItemController.js";
import SessionController from "./controllers/SessionController.js";

const routes = new Router()

routes.get('/', HelloController.index)
routes.post('/usuario', UsuarioController.create)
routes.post('/session', SessionController.create)

routes.get('/usuario', UsuarioController.index)
routes.get('/usuario/:ID', UsuarioController.show)
routes.delete('/usuario/:ID', UsuarioController.delete)

routes.get('/usuario/:UsuarioID/todo', ToDoController.index)
routes.post('/usuario/:UsuarioID/todo', ToDoController.create)
routes.delete('/usuario/:UsuarioID/todo/:ID', ToDoController.delete)
routes.put('/usuario/:UsuarioID/todo/:ID', ToDoController.update)
routes.patch('/usuario/:UsuarioID/todo/:ID', ToDoController.updateState)
routes.get('/usuario/:UsuarioID/todocount', ToDoController.count)

routes.get('/usuario/:UsuarioID/todo/:ToDoID/itens', ItemController.index)
routes.post('/usuario/:UsuarioID/todo/:ToDoID/item', ItemController.create)
routes.delete('/usuario/:UsuarioID/todo/:ToDoID/item/:ID', ItemController.delete)
routes.put('/usuario/:UsuarioID/todo/:ToDoID/item/:ID', ItemController.update)
routes.patch('/usuario/:UsuarioID/todo/:ToDoID/item/:ID', ItemController.updateState)
routes.get('/usuario/:UsuarioID/todo/:ToDoID/itemcountTotal', ItemController.countTotal)
routes.get('/usuario/:UsuarioID/todo/:ToDoID/itemcountToDo', ItemController.countToDo)


export default routes