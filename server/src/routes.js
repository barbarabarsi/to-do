import { Router } from "express";

import HelloController from "./controllers/HelloController.js";

const routes = new Router()

routes.get('/', HelloController.index)
routes.get('/teste', HelloController.teste)

export default routes