// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);

const Direccion = models.direccionEnvio;
//Subir direccion de envio de un usuario
class DireccionEnvioController {
  async createDireccionEnvio(req, res) {
    console.log("Params recibidos:", req.params);
    const id_usuario = req.params.idusuario;
    const direccionData = req.body;

    try {
      if (!id_usuario) {
        return res
          .status(400)
          .json(Respuesta.error(null, "No se proporcionó id_usuario."));
      }
      direccionData.id_usuario = id_usuario;

      const nuevaDireccion = await Direccion.create(direccionData);

      res
        .status(201)
        .json(
          Respuesta.exito(
            nuevaDireccion,
            "Dirección de envío creada exitosamente."
          )
        );
    } catch (error) {
      logMensaje("Error: " + error);
      res
        .status(500)
        .json(Respuesta.error("Error al crear la dirección de envío."));
    }
  }

  async getDireccionesByUser(req, res) {
    const id_usuario = req.params.idusuario;

    try {
      if (!id_usuario) {
        return res
          .status(400)
          .json(Respuesta.error(null, "No se proporcionó id_usuario."));
      }
      const direcciones = await Direccion.findAll({
        where: { id_usuario: id_usuario },
        order: [["id_direccion", "ASC"]],
      });
      res
        .status(200)
        .json(
          Respuesta.exito(direcciones, "Direcciones recuperadas exitosamente.")
        );
    } catch (error) {
      console.error("Error al recuperar direcciones:", error);
      res
        .status(500)
        .json(Respuesta.error("Error al recuperar las direcciones de envío."));
    }
  }

  async deleteDireccionEnvio(req, res) {
    const id_usuario = req.params.idusuario;
    const id_direccion = req.params.iddireccion;

    try {
      const direccion = await Direccion.findOne({
        where: {
          id_direccion: id_direccion,
          id_usuario: id_usuario,
        },
      });
      if (!direccion) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Dirección no encontrada."));
      }
      await direccion.destroy();
      res
        .status(200)
        .json(Respuesta.exito(null, "Dirección eliminada exitosamente."));
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      res
        .status(500)
        .json(Respuesta.error("Error al eliminar la dirección de envío."));
    }
  }

  async updateDireccionEnvio(req, res) {
    const id_usuario = req.params.idusuario;
    const { id_direccion, ...updateData } = req.body;

    try {
      if (!id_usuario || !id_direccion) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "No se proporcionó id_usuario o id_direccion."
            )
          );
      }
      const direccion = await Direccion.findOne({
        where: {
          id_direccion: id_direccion,
          id_usuario: id_usuario,
        },
      });
      if (!direccion) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Dirección no encontrada."));
      }
      await direccion.update(updateData);
      res
        .status(200)
        .json(
          Respuesta.exito(direccion, "Dirección actualizada exitosamente.")
        );
    } catch (error) {
      console.error("Error al actualizar dirección:", error);
      res
        .status(500)
        .json(Respuesta.error("Error al actualizar la dirección de envío."));
    }
  }
}
module.exports = new DireccionEnvioController();
