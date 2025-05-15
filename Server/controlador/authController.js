const db = require('../database');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: "Campos requeridos" });
    }
    
    db.query('SELECT * FROM vista_usuario WHERE usuario = ?', [usuario], async (err, results) => {

        if (err) return res.status(500).json({ error: err });
    
        if (results.length === 0) {          
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
    
        const user = results[0];     
    
        const validPassword = await bcrypt.compare(password, user.password);       
    
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
    
        res.status(200).json({ 
            message: "Login exitoso", 
            user: { 
                id: user.id_usuario, 
                usuario: user.usuario,  
                rol: user.rol,
                idRol: user.idRol
            } 
        });
    });
};

module.exports = { login };
