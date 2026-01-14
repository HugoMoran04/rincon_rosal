// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

// Importar fichero de configuración con variables de entorno
const config = require("./config/config");
// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");

const session = require("express-session");

const categoriaRoutes = require("./routes/categoriaRoutes");
const direccionEnvioRoutes = require("./routes/direccionEnvioRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const favoritosRoutes = require("./routes/favoritosRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  // Configurar CORS para admitir el origen del frontend en desarrollo
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //1 dia
    },
  })
);

// Configurar rutas de la API Rest
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/direccionesEnvio", direccionEnvioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/pedidos", pedidoRoutes);

// Configurar el middleware para servir archivos estáticos desde el directorio 'public\old_js_vainilla'
app.use(express.static(path.join(__dirname, "public")));

//Ruta para manejar las solicitudes al archivo index.html
// app.get('/', (req, res) => {
//app.get("/*", (req, res) => {
if (process.env.NODE_ENV !== "production") {
  console.log("Sirviendo ficheros de desarrollo");

  app.use(express.static(path.join(__dirname, "public/dev")));

  app.get("/*", (req, res) => {
    if (req.path.startsWith("/api")) return res.sendStatus(404);
    res.sendFile(path.join(__dirname, "public/dev", "index.html"));
  });

} else {
  console.log("Sirviendo ficheros de producción");

  app.use(express.static(path.join(__dirname, "public/prod")));

  app.get("/*", (req, res) => {
    if (req.path.startsWith("/api")) return res.sendStatus(404);
    res.sendFile(path.join(__dirname, "public/prod", "index.html"));
  });
}

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});

