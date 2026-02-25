
import { pool } from '../Connetion/db.js';

export async function EncontrarEmpleado(Cedula) {
  try {
    const [rows] = await pool.execute(
      'SELECT nombre, sede, cedula, cargo FROM empleados WHERE cedula = ?',
      [Cedula]
    );

    // Si no hay resultados, puedes devolver null (recomendado)
    if (!rows || rows.length === 0) {
      return null;
    }

    const emp = rows[0];

    return {
      Nombre: emp?.nombre ?? 'No existe',
      Regional: emp?.sede ?? 'No existe',
      Cedula: emp?.cedula ?? 'No existe',
      Cargo: emp?.cargo ?? 'No existe',
    };
  } catch (error) {
    console.error('Error en la consulta de empleado:', error);
    // Mantén consistencia en el retorno cuando falla
    return null;
  }
}
