import { Router } from "express";

import HelloController from "./controllers/HelloController.js";
import UsuarioController from "./controllers/UsuarioController.js";
import ToDoController from "./controllers/ToDoController.js";
import ItemController from "./controllers/ItemController.js";

const routes = new Router()

routes.get('/', HelloController.index)

routes.get('/usuario', UsuarioController.index)
routes.get('/usuario/:ID', UsuarioController.show)
routes.post('/usuario', UsuarioController.create)
routes.delete('/usuario/:ID', UsuarioController.delete)

routes.get('/usuario/:UsuarioID/todo', ToDoController.index)
routes.post('/usuario/:UsuarioID/todo', ToDoController.create)
routes.delete('/usuario/:UsuarioID/todo/:ID', ToDoController.delete)
routes.put('/usuario/:UsuarioID/todo/:ID', ToDoController.update)
routes.patch('/usuario/:UsuarioID/todo/:ID', ToDoController.updateState)
routes.get('/usuario/:UsuarioID/todototal', ToDoController.count)

routes.get('/item', ItemController.index)


export default routes