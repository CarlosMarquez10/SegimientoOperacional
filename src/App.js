import express from 'express';
import getCorreriaPte from './routes/Correria.routes.js';
import 'dotenv/config';

const port = process.env.PORT

const app = express();
app.use(express.json());


app.use('/correria', getCorreriaPte)

app.listen(port, () => {
  console.log(`corriendo en el puerto ${port}`);
});
