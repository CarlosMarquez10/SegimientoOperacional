import {Router} from 'express';
import { ConsultaCorreriatpl } from '../controller/consultas.controller';

ConsultaCorreriatpl

const route = Router()

route.post('/tpl',ConsultaCorreriatpl)

export default route;