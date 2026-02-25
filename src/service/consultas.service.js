import { pool } from "../Connetion/db.js";

export async function ConsultarCorreria(NumCorreria) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM revisiones_sirius WHERE Correria = ?",
      [NumCorreria],
    );
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(`Error al consultar correria ${NumCorreria}:`, error);
    return null;
  }
}
