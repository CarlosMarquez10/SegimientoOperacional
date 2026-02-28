import { EncontrarEmpleado } from "../service/consultarEmpleado.service.js";
import { ConsultarCorreria } from "../service/consultas.service.js";

export const ConsultaCorreriatpl = async (req, res) => {
  try {
    const { NumCorreria, CantidadOst } = req.body;

    let cantidadDescargadas = 0;
    let cantidadDescargadaCanceladas = 0;
    let cantidadDescargadaSinImprimir = 0;
    let cantidadDescargadaImpresa = 0;
    let OtsPendientesCount = 0;
    let OtsPendientes = [];
    let datapte = [];

    if (!NumCorreria) {
      return res.status(400).json({ message: "Falta el número de correria" });
    }

    const Result = await ConsultarCorreria(NumCorreria);
    const cantidad = Result ? Result.length : 0;

    if (!Array.isArray(Result) || Result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron órdenes de trabajo para la correria proporcionada",
      });
    }

    // Mapea asincrónicamente y espera a todas las promesas
    const Datafin = await Promise.all(
      Result.map(async (Elem) => {
        const operario = await EncontrarEmpleado(Elem.UsuarioLabor);
        if (Elem.EstadoComunicacion == "D") {
          cantidadDescargadas = cantidadDescargadas + 1;
        }

        if (Elem.EstadoComunicacion == "C") {
          OtsPendientes.push({
            Correria: Elem.Correria,
            IdCliente: Elem.IdCliente,
            DescripcionTarea: Elem.DescripcionTarea,
            Revision: Elem.Revision,
            Direccion: Elem.Direccion,
            Medidor: Elem.Medidor,
            Ciclo: Elem.Ciclo,
            RutaLectura: Elem.RutaLectura,
            EstadoComunicacion: Elem.EstadoComunicacion,
            EstadoTarea: Elem.EstadoTarea,
            UsuarioLabor: Elem.UsuarioLabor,
            Operario: operario ?? {
              Nombre: "No existe",
              Regional: "No existe",
              Cedula: "No existe",
              Cargo: "No existe",
            },
            TerminalDescarga: Elem.TerminalDescarga,
            Coordenada: Elem.GPS,
          });
          OtsPendientesCount++;
        }

        if (Elem.EstadoTarea == "I") {
          cantidadDescargadaImpresa = cantidadDescargadaImpresa + 1;
        }

        if (Elem.EstadoTarea == "C") {
          cantidadDescargadaCanceladas = cantidadDescargadaCanceladas + 1;
          datapte.push({
            Correria: Elem.Correria,
            IdCliente: Elem.IdCliente,
            DescripcionTarea: Elem.DescripcionTarea,
            Revision: Elem.Revision,
            Direccion: Elem.Direccion,
            Medidor: Elem.Medidor,
            Ciclo: Elem.Ciclo,
            RutaLectura: Elem.RutaLectura,
            EstadoComunicacion: Elem.EstadoComunicacion,
            EstadoTarea: Elem.EstadoTarea,
            UsuarioLabor: Elem.UsuarioLabor, // nombre consistente
            Operario: operario ?? {
              Nombre: "No existe",
              Regional: "No existe",
              Cedula: "No existe",
              Cargo: "No existe",
            },
            TerminalDescarga: Elem.TerminalDescarga,
            Coordenada: Elem.GPS,
          });
        }

        if (Elem.EstadoTarea == "E") {
          cantidadDescargadaSinImprimir = cantidadDescargadaSinImprimir + 1;
        }
        return {
          Correria: Elem.Correria,
          IdCliente: Elem.IdCliente,
          DescripcionTarea: Elem.DescripcionTarea,
          Revision: Elem.Revision,
          Direccion: Elem.Direccion,
          Medidor: Elem.Medidor,
          Ciclo: Elem.Ciclo,
          RutaLectura: Elem.RutaLectura,
          EstadoComunicacion: Elem.EstadoComunicacion,
          EstadoTarea: Elem.EstadoTarea,
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

    return res.status(200).json({ CantidadOst, cantidadDescargadas, cantidadDescargadaImpresa, cantidadDescargadaCanceladas, cantidadDescargadaSinImprimir, OtsPendientesCount, OtsPendientes, data: Datafin, datapte, cantidad });
  } catch (error) {
    console.error("Problema al procesar los datos recibidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

