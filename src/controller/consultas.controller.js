import { EncontrarEmpleado } from "../service/consultarEmpleado.service.js";
import { ConsultarCorreria } from "../service/consultas.service.js";

export const ConsultaCorreriatpl = async (req, res) => {
  try {
    const { NumCorreria } = req.body;

    if (!NumCorreria) {
      return res.status(400).json({ message: "Falta el número de correria" });
    }

    const Result = await ConsultarCorreria(NumCorreria);

    if (!Array.isArray(Result) || Result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron órdenes en la correria especificada",
      });
    }

    // Mapea asincrónicamente y espera a todas las promesas
    const Datafin = await Promise.all(
      Result.map(async (Elem) => {
        const operario = await EncontrarEmpleado(Elem.UsuarioLabor);

        return {
          Correria: Elem.Correria,
          DescripcionTarea: Elem.DescripcionTarea,
          Direccion: Elem.Direccion,
          Medidor: Elem.Medidor,
          Ciclo: Elem.Ciclo,
          RutaLectura: Elem.RutaLectura,
          EstadoComunicacion: Elem.EstadoComunicacion,
          UsuarioLabor: Elem.UsuarioLabor, // nombre consistente
          Operario: operario ?? {
            Nombre: "No existe",
            Regional: "No existe",
            Cedula: "No existe",
            Cargo: "No existe",
          },
          TerminalDescarga: Elem.TerminalDescarga,
          Coordenada: Elem.GPS,
        };
      })
    );

    return res.status(200).json({ data: Datafin });
  } catch (error) {
    console.error("Problema al procesar los datos recibidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

