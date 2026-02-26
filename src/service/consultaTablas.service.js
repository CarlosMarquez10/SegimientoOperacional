import {pool} from '../Connetion/db.js';

export async function TablaCorreria () {
  try {
    const [rows] = await pool.execute('SELECT correria FROM correrias');
    if (!rows || rows.length === 0) return null;
    return rows; // <-- los datos para compartir o manejar en otro modulos
  } catch (error) {
    console.error('Error en TablaCorreria:', error);
    throw error; // para que quien llame pueda manejarlo
  }
}


// tabla de revisiones Sirius

export async function TablaRevisionesSirius () {
    try {
        const [rows] = await pool.execute('SELECT * FROM revisiones_sirius');
        if (!rows || rows.length === 0) return null;
        console.log('Datos de TablaRevisionesSirius:', rows); // <-- para verificar los datos obtenidos
        return rows; // <-- los datos para compartir o manejar en otro modulos
    } catch (error) {
        console.error('Error en TablaRevisionesSirius:', error);
        throw error; // para que quien llame pueda manejarlo
    }
}

TablaRevisionesSirius();