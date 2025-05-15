const db = require('../database');

const getRol = (req, res) => {
      db.query('SELECT * FROM tb_rol', (err, results)=>{
            if (err) {
                  console.error('Error al mostar rol', err);
                  return res.status(500).json({error: 'Error al servidor'})
                  
            }
            res.status(200).json({rol: results})
      })

};



// Crear un nuevo rol usando el procedimiento almacenado PROC_AGREGAR_ROL
const postRol = (req, res) => {
    
      const { rol, permisos } = req.body;
      if (!rol || !Array.isArray(permisos)) {
        return res.status(400).json({
          message: 'Tipo (string) y permisos (arreglo) son obligatorios'
        });
      }
    
      const permisosJson = JSON.stringify(permisos);
    
      // Sin async/await, usamos callback
      db.query('CALL PROC_AGREGAR_ROL(?, ?)', [rol, permisosJson], (err, results) => {
        if (err) {
          console.error('Error al crear rol:', err);
          if (err.sqlState === '45000') {
            return res.status(409).json({ message: err.message });
          }
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
    
        
        return getRol(req, res);
      });
    };
    

    const putRol = (req, res) => {

        // const {id, tipo, permisos } = req.body;
        const id = parseInt(req.params.id, 10);
        const { rol, permisos } = req.body;

        if (!id || !rol || !Array.isArray(permisos)) {
          return res.status(400).json({
            message: 'Tipo (string) y permisos (arreglo) son obligatorios'
          });
        }
      
        const permisosJson = JSON.stringify(permisos);
      
     
        db.query('CALL PROC_EDITAR_ROL(?, ?, ?)', [id, rol, permisosJson], (err, results) => {
          if (err) {
            console.error('Error al crear rol:', err);
            if (err.sqlState === '45000') {
              return res.status(409).json({ message: err.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
            console.log(res);
            
          return res.status(200).json({ message: 'Rol actualizado correctamente' });
        });
      };
      


    module.exports = { getRol, postRol, putRol };
    