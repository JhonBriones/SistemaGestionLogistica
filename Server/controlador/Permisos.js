const db = require('../database');

const getPermiso =(req, res)=>{
      db.query('SELECT * FROM vista_permisos', (err, result) =>{
            if (err) {
                  console.error('Error al mostar permisos');
                  return res.status(500).json({error: 'Error al servidor'})
                  
            }

            res.status(200).json({permiso: result})
      })
}

module.exports={getPermiso};