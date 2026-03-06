import { pool } from "../Connetion/db.js";

export async function GetCars() {
  try {

    const tipoCars = ["HSX795",
      "GJU140",
      "GCU826",
      "CWZ891",
      "MGY346",
      "JZM050",
      "CUX039",
      "HPW184"
,"LTO423"];   

    const [rows] = await pool.execute(
      "SELECT * FROM cars",
    );
    // recorrer el array de resultados y mostrar algunas propiedaddes con map

        const cars = rows.map(car => ({
          alias: car.alias,
          longitude: car.longitude,
          latitude: car.latitude,
          speed: car.speed,
          active: car.active,
          marker_color: car.active === "ONLINE" ? car.marker_color : "#FF2C2C",
          type: tipoCars.includes(car.alias) ? "carro" : "moto" // Asigna el tipo basado en el alias
        }));


   // console.log(rows[0]);
    return cars.length > 0 ? cars : null;
  } catch (error) {
    console.error(`Error al consultar correria:`, error);
    return null;
  }
}