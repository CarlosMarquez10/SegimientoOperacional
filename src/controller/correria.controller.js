import { TbCorreria } from "../service/correria.service.js"

export const CorreriaPendientes = (req, res) =>{
   // consultar en la tabla de correria hacer un select *

   try {

      const dataCorreria = TbCorreria();
      res.send(dataCorreria)
      
   } catch (error) {
      console.log('problema al procesar los datos recibidos')
   }
}
