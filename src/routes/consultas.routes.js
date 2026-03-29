
import { Router } from 'express';
import { ConsultaCorreriatpl, ConsultarCars } from '../controller/consultas.controller.js';

const route = Router();

route.post('/tpl', ConsultaCorreriatpl);
route.post('/cars', ConsultarCars);

export default route;
