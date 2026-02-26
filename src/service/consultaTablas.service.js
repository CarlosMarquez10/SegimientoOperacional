import {pool} from '../Connetion/db.js';

export async function TablaCorreria () {

    try {
        const [rows] = await pool.execute('SELECT * FROM correrias')
        if(!rows || rows.length === 0){
            return null;
        }
        const data = rows.map((e)=>{
            return {
                correria: e.Correia
            }
        })

        
        return json({data: data});

    } catch (error) {
        
    }
}

console.log(TablaCorreria()) 