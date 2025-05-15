// backend/index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); 
const usuarioRoutes = require('./routes/usuarioRoutes');
const chatRoutes = require('./routes/chatRoutes');
const rolRoutes  = require('./routes/rol');
const permisos = require('./routes/Permisos');
const camionesRoutes = require("./routes/camionesRoutes");
const conductoresRoutes = require("./routes/conductoresRoutes")
const rutasRoutes = require("./routes/rutasRoutes")
const entregasRoutes = require("./routes/entregasRoutes")
const tareasRoutes = require("./routes/tareasRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(bodyParser.json()); 

// Rutas de autenticación
app.use('/api', authRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', chatRoutes);
app.use('/api/rol', rolRoutes);
app.use('/api', permisos)
app.use("/api", conductoresRoutes)
app.use("/api", camionesRoutes)
app.use("/api", rutasRoutes)
app.use("/api", entregasRoutes)
app.use("/api", tareasRoutes)
app.use("/api", dashboardRoutes)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

