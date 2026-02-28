import { pool } from "../Connetion/db.js";

export async function ConsultarCorreria(NumCorreria) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM revisiones_sirius_master WHERE Correria = ?",
      [NumCorreria],
    );
   // console.log(rows[0]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(`Error al consultar correria ${NumCorreria}:`, error);
    return null;
  }
}
