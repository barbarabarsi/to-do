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

routes.get('/to-do', ToDoController.index)

routes.get('/item', ItemController.index)


export default routes