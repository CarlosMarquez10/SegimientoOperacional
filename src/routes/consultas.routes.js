import {Router} from 'express';

import { ConsultarCorreria } from '../service/consultas.service.js';

const route = Router()

route.post('/tpl',ConsultarCorreria)

export default route;