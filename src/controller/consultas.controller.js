
import { ConsultarCorreria } from "../service/consultas.service.js";

export const ConsultaCorreriatpl = async (req, res) => {
  try {
    const { NumCorreria } = req.body;

    if (!NumCorreria) {
      return res.status(400).json({ message: "Falta el número de correria" });
    }

    const Result = await ConsultarCorreria(NumCorreria);

    if (Result === null) {
      return res.status(404).json({
        message: "No se encontraron órdenes en la correria especificada",
      });
    }

    return res.status(200).json({ data: Result });

  } catch (error) {
    console.error('Problema al procesar los datos recibidos:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

