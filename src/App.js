import express from 'express';
import getCorreriaPte from './routes/Correria.routes.js';
import CorreriaTpl from './routes/consultas.routes.js';
import 'dotenv/config';

const port = process.env.PORT

const app = express();
app.use(express.json());


app.use('/correria', getCorreriaPte);
app.use('/ConsultaCoreria', CorreriaTpl);

app.listen(port, () => {
  console.log(`corriendo en el puerto ${port}`);
});
