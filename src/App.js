import express from 'express';
import getCorreriaPte from './routes/Correria.routes.js';
import CorreriaTpl from './routes/consultas.routes.js';
import cors from 'cors';
import 'dotenv/config';

const port = process.env.PORT


const app = express();
app.use(express.json());
// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://viernesci.web.app',  // Tu producción
    'https://viernesci.firebaseapp.com' // El espejo de Firebase
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));




app.use('/correria', getCorreriaPte);
app.use('/correria', CorreriaTpl);

app.listen(port, () => {
  console.log(`corriendo en el puerto ${port}`);
});
