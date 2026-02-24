import express from 'express';
import getCorreriaPte from './routes/Correria.routes.js'

const app = express();
app.use(express.json());
const port = 3012;

app.use('/correria', getCorreriaPte)

app.listen(port, () => {
  console.log(`corriendo en el puerto ${port}`);
});
