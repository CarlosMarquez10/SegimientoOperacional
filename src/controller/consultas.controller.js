import { ConsultarCorreria } from "../service/consultas.service";

export const ConsultaCorreriatpl = async (req, res) => {
  const [NumCorreria] = req.body;

  try {
    if (NumCorreria) {
      const Result = await ConsultarCorreria(NumCorreria);

      if (Result == null) {
        return res
          .status(404)
          .json({
            message: "No se encontraron ordenes de en la correrias programadas",
          });
      }

      return res.status(200).json({ data: Result });
    }
  } catch (error) {
    console.error('Problema al procesar los datos recibidos:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
