
import { Router } from 'express';
import { ConsultarCars } from '../controller/consultas.controller.js';

const route = Router();

route.post('/cars', ConsultarCars);

export default route;