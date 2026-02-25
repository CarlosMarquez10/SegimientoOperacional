import {pool} from '../Connetion/db.js'

export async function TbCorreria() {
    
    try {
        
    const [row] = pool.execute('SELECT * FROM correria')
    return row;

    } catch (error) {
        console.error(error, 'error al consultar las correria programadas.')
    }
}