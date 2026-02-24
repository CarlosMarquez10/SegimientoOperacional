import express from 'express'
import {CorreriaPendientes} from '../controller/correria.controller.js';

const route = express();
route.get('/pte', CorreriaPendientes)


export default route;
