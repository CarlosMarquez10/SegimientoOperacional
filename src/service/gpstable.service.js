import { pool } from "../Connetion/db.js";

export async function GetCars() {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM cars",
    );
   // console.log(rows[0]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(`Error al consultar correria:`, error);
    return null;
  }
}