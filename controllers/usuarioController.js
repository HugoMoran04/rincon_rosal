// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);

// Importar bcrypt para hashear contraseñas
const bcrypt = require("bcrypt");

//Importar express-session
const session = require("express-session");

// Recuperar el modelo Usuario
const Usuario = models.usuarios;

class UsuarioController {
  // Crear un nuevo usuario
  async createUsuario(req, res) {
    const usuario = req.body;
    try {
      const contrasenaHasheada = await bcrypt.hash(usuario.contrasena, 10);
      usuario.contrasena = contrasenaHasheada;

      const nuevoUsuario = await Usuario.create(usuario);
      res.status(201).json(Respuesta.exito(nuevoUsuario, "Usuario creado"));
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear el usuario: ${usuario}`));
    }
  }

  async getAllUsuarios(req, res) {
    try {
      const data = await Usuario.findAll();
      res.json(Respuesta.exito(data, "Datos de todos los usuarios"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los usuarios: ${req.originalUrl}`
          )
        );
    }
  }

  async deleteUsuario(req, res) {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
      console.log("Intentando eliminar usuario:", id_usuario);
      const numFilas = await Usuario.destroy({
        where: { id_usuario: id_usuario },
      });
      console.log("Filas eliminadas:", numFilas);
      if (numFilas === 0) {
        res
          .status(404)
          .json(
            Respuesta.error(null, `Usuario con id ${id_usuario} no encontrado`)
          );
      } else {
        res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar el usuario ${req.originalUrl}`
          )
        );
    }
  }

  async updateUsuario(req, res) {
    const usuario = req.body;
    const id_usuario = req.params.idusuario;

    if (id_usuario != usuario.id_usuario) {
      return res
        .status(400)
        .json(Respuesta.error(null, "ID de usuario no coincide"));
    }

    try {
      const datosAActualizar = { ...usuario };
      delete datosAActualizar.contrasena; // Eliminar la contraseña del objeto a actualizar
      const numFilas = await Usuario.update(
        //{ ...usuario },
        datosAActualizar,
        { where: { id_usuario } }
      );
      if (numFilas[0] === 0) {
        res
          .status(404)
          .json(
            Respuesta.error(null, "No  encontrado o sin cambios: " + id_usuario)
          );
      } //else {
      //res.status(204).send();
      //}

      const usuarioActualizado = await Usuario.findByPk(id_usuario, {
        attributes: [
          "id_usuario",
          "nombre",
          "apellidos",
          "telefono",
          "email",
          "edad",
          "rol",
        ],
      });

      res
        .status(200)
        .json(
          Respuesta.exito(
            usuarioActualizado,
            "Usuario actualizado correctamente"
          )
        );
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar el usuario ${req.originalUrl}`
          )
        );
    }
  }

  async loginUsuario(req, res) {
    const { email, contrasena } = req.body;
    console.log("🟢 Email recibido:", email);
    console.log("🟢 Contraseña recibida:", contrasena);

    if (!email || !contrasena) {
      return res
        .status(400)
        .json(Respuesta.error(null, "Email y contraseña son requeridos"));
    }

    try {
      const usuario = await Usuario.findOne({ where: { email }, raw:true });
      console.log(usuario.rol);
      if (!usuario) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Email no encontrado"));
      }
      const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena
      );
      if (!contrasenaValida) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Contraseña incorrecta"));
      }

      req.session.regenerate((err) => {
        if (err) {
          console.error("Error al regenerar sesión:", err);
          return res
            .status(500)
            .json(Respuesta.error(null, "Error al procesar login"));
        }

        req.session.usuario = {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
          apellidos: usuario.apellidos,
          telefono: usuario.telefono,
          edad: usuario.edad,
          rol: usuario.rol,
        };
        res
          .status(200)
          .json(Respuesta.exito(req.session.usuario, "Login exitoso"));
      });
    } catch (err) {
      logMensaje("Error login: " + err);
      res
        .status(500)
        .json(Respuesta.error(null, "Error en el proceso de login"));
    }
  }

  async getAllUsuarios(req, res) {
    try {
      const data = await Usuario.findAll(); // Recuperar todos los platos
      res.json(Respuesta.exito(data, "Datos de platos recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los platos: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = new UsuarioController();
