// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);

const Favoritos = models.favoritos;
const Producto = models.producto;
const Usuarios = models.usuarios;

class FavoritosController {
  // Crear un nuevo favorito
  async createFavorito(req, res) {
   /* const favorito = req.body;
    console.log("Creando favorito:", favorito);
    try {
      const userExists = await Usuarios.findByPk(favorito.id_usuario);
      if (!userExists) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El usuario no existe."));
      }
      const productExists = await Producto.findByPk(favorito.id_producto);
      if (!productExists) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El producto no existe."));
      }

      const nuevoFavorito = await Favoritos.create(favorito);
      res.status(201).json(Respuesta.exito(nuevoFavorito, "Favorito creado"));
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear el favorito: ${favorito}`));
    }*/
   const { id_usuario, id_producto } = req.body;

  try {
    // Verificar si el favorito ya existe
    const existing = await Favoritos.findOne({ where: { id_usuario, id_producto } });
    if (existing) {
      return res.status(200).json(Respuesta.exito(existing, "Favorito ya existe"));
    }

    const userExists = await Usuarios.findByPk(id_usuario);
    if (!userExists) return res.status(400).json(Respuesta.error(null, "El usuario no existe"));

    const productExists = await Producto.findByPk(id_producto);
    if (!productExists) return res.status(400).json(Respuesta.error(null, "El producto no existe"));

    const nuevoFavorito = await Favoritos.create({ id_usuario, id_producto });
    res.status(201).json(Respuesta.exito(nuevoFavorito, "Favorito creado"));
  } catch (err) {
    console.error(err);
    res.status(500).json(Respuesta.error(null, "Error al crear favorito"));
  }

  }

  // Obtener todos los favoritos
  async getAllFavoritos(req, res) {
    try {
      const data = await Favoritos.findAll();
      res.json(Respuesta.exito(data, "Datos de todos los favoritos"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los favoritos: ${req.originalUrl}`
          )
        );
    }
  }

  // Eliminar un favorito por id
  async deleteFavorito(req, res) {
    const id_favorito = parseInt(req.params.id_favorito);
    try {
      console.log("Intentando eliminar favorito:", id_favorito);
      const numFilas = await Favoritos.destroy({
        where: { id_favorito: id_favorito },
      });
      if (numFilas === 0) {
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Favorito con id ${id_favorito} no encontrado`
            )
          );
        return;
      } else {
        res.json(   
          Respuesta.exito(null, `Favorito con id ${id_favorito} eliminado`)
        );
      }
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar el favorito ${req.originalUrl}`
          )
        );
    }
  }

  /*async getFavoritosByUsuario(req, res) {
    const id_usuario = parseInt(req.params.id_usuario);

    try {

        const usuarioExiste = await Usuarios.findByPk(id_usuario);
            if (!usuarioExiste) {
                return res.status(400).json(
                    Respuesta.error(null, `El usuario con id ${id_usuario} no existe`)
                );
            }
      const favoritos = await Favoritos.findAll({
        where: { id_usuario },
        include: [
          {
            model: Producto,
            as: "id_producto_producto",
          },
        ],
      });

      res.json(Respuesta.exito(favoritos, "Favoritos del usuario"));
    } catch (err) {
      logMensaje("Error GetFavoritos: " + err);
      res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener favoritos del usuario"));
    }
  }*/

    async getFavoritosByUsuario(req, res) {
  const { id_usuario } = req.params;

  try {
    const favoritos = await Favoritos.findAll({
      where: { id_usuario },
      attributes: ['id_favorito', 'id_producto', 'id_usuario']  // <-- IMPORTANTE
    });

    res.json(
      Respuesta.exito(
        favoritos,
        "Favoritos obtenidos correctamente"
      )
    );

  } catch (error) {
    console.error(error);
    res.status(500).json(
      Respuesta.error(null, "Error al obtener favoritos")
    );
  }
}
}

module.exports = new FavoritosController();
