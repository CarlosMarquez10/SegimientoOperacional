
import { Router } from 'express';
import { ConsultaCorreriatpl } from '../controller/consultas.controller.js';

const route = Router();

route.post('/tpl', ConsultaCorreriatpl);

export default route;
