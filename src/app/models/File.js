const db = require('../../config/db')
const fs = require('fs')

module.exports = {

    create({filename, path, product_id}) {



        const query = `INSERT INTO files(
            name,
            path,
            product_id
            ) VALUES ($1, $2, $3)
        RETURNING id`




        const values = [
            filename, //esse nome é devido ao arquivo middleware de cconfiguração mo multer
            path,
            product_id
            ]

        return db.query(query, values)
        

    },

async delete(id){

    try{

    const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
    const file = result.rows[0]

    fs.unlinkSync(file.path) //comando para pegar o caminho da foto a ser apagada localmente (fs)
    
    return db.query(`
    DELETE FROM files WHERE id = $1
    `, [id]) //Delete o banco de dados, mas é preciso apagar do computador na public images
    
    }catch(err){
        console.error(err)
    }




    
    
}



   

}