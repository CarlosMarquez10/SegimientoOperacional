import {pool} from '../Connetion/db.js';

export async function TablaCorreria () {
  try {
    const [rows] = await pool.execute('SELECT * FROM correrias');
    if (!rows || rows.length === 0) return null;

    const data = rows.map((e) => ({
      correria: e.Correia 
    }));

    return data; // <-- los datos para compartir o manejar en otro modulos
  } catch (error) {
    console.error('Error en TablaCorreria:', error);
    throw error; // para que quien llame pueda manejarlo
  }
}

// Luego:
TablaCorreria()
  .then((data) => console.log(data))
  .catch(console.error);
