import { TbCorreria } from "../service/correria.service.js";

export const CorreriaPendientes = async (req, res) => {
  try {
    // Espera el resultado de la consulta
    const dataCorreria = await TbCorreria(); // como es async se coloca await

    // Si tu función puede devolver null (no encontrado)
    if (dataCorreria == null) {
      return res.status(404).json({ message: 'No se encontraron correrias programadas' });
    }

    // Si devuelve array, valida vacío (opcional)
    if (Array.isArray(dataCorreria) && dataCorreria.length === 0) {
      return res.status(200).json({ data: [], message: 'No hay correrias programadas' });
    }

    // Respuesta OK
    return res.status(200).json({ data: dataCorreria });
  } catch (error) {
    console.error('Problema al procesar los datos recibidos:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

