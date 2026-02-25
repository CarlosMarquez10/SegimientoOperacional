import {pool} from '../Connetion/db.js'

export async function TbCorreria() {
    
    try {
        
    const [row] = await pool.execute('SELECT * FROM correrias')
    if(row.length === 0) {
        return null;
    }

    return row;

    } catch (error) {
        console.error(error, 'error al consultar las correria programadas.')
    }
}