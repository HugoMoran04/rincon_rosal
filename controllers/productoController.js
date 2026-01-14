// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
const {Op} = require("sequelize");

const Producto = models.producto;

class ProductoController {
    // Crear un nuevo producto

    async createProducto(req, res) {
        const producto = req.body;
        console.log("Creando producto:", producto);
        try {
            const nuevoProducto = await Producto.create(producto);
            res.status(201).json(Respuesta.exito(nuevoProducto, "Producto creado"));
        } catch (err) {
            logMensaje("Error: " + err);
            res
                .status(500)
                .json(
                    Respuesta.error(null, `Error al crear el producto: ${producto}`)
                );
        }
    }

    // Obtener todos los productos
    async getAllProductos(req, res) {
        try {
            const data = await Producto.findAll();
            res.json(Respuesta.exito(data, "Datos de todos los productos"));
        } catch (err) {
            res
                .status(500)
                .json(
                    Respuesta.error(
                        null,
                        `Error al recuperar los productos: ${req.originalUrl}`
                    )
                );
        }
    }

    // Eliminar un producto por id
    async deleteProducto(req, res) {
        const id_producto = parseInt(req.params.id_producto);
        try {
            console.log("Intentando eliminar producto:", id_producto);
            const numFilas = await Producto.destroy({
                where: { id_producto: id_producto },
            });
            if (numFilas === 0) {
                res
                    .status(404)
                    .json(
                        Respuesta.error(
                            null,
                            `Producto con id ${id_producto} no encontrado`
                        )
                    );
            } else {
                res.json(
                    Respuesta.exito(null, `Producto con id ${id_producto} eliminado`)
                );
            }
        } catch (err) {
            logMensaje("Error: " + err);
            res
                .status(500)
                .json(
                    Respuesta.error(
                        null,
                        `Error al eliminar el producto con id ${id_producto}`
                    )
                );
        }
    }

    // Actualizar un producto por id
    async updateProducto(req, res) {
        const producto = req.body;
        const id_producto = req.params.id_producto;
        if (id_producto != producto.id_producto) {
            return res
                .status(400)
                .json(
                    Respuesta.error(
                        null,
                        "El ID del producto en la URL no coincide con el ID en el cuerpo"
                    )
                );
        }
        try {
            const numFilas = await Producto.update(
                { ...producto },
                { where: { id_producto } }
            );
            if (numFilas[0] === 0) {
                res
                    .status(404)
                    .json(
                        Respuesta.error(
                            null,
                            `Producto con id ${id_producto} no encontrado`
                        )
                    );
            } else {
                res.json(
                    Respuesta.exito(
                        null,
                        `Producto con id ${id_producto} actualizado`
                    )
                );
            }
        } catch (err) {
            logMensaje("Error: " + err);
            res
                .status(500)
                .json(
                    Respuesta.error(
                        null,
                        `Error al actualizar el producto con id ${id_producto}`
                    )
                );
        }
    }

    // Obtener un producto por id
    async getProductoById(req, res) {
        const id_producto = parseInt(req.params.id_producto);
        try {
            const producto = await Producto.findByPk(id_producto);
            if (producto) {
                res.json(
                    Respuesta.exito(
                        producto,
                        `Producto con id ${id_producto} encontrado`
                    )
                );
            } else {
                res
                    .status(404)
                    .json(
                        Respuesta.error(
                            null,
                            `Producto con id ${id_producto} no encontrado`
                        )
                    );
            }
        } catch (err) {
            logMensaje("Error: " + err);
            res
                .status(500)
                .json(
                    Respuesta.error(
                        null,
                        `Error al recuperar el producto con id ${id_producto}`
                    )
                );
        }
    }

    async getFavoritesProductsByIds(req, res) {
        const { ids } = req.body; // Esperamos { ids: [4,5,6] }

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json(Respuesta.error(null, "IDs inválidos"));
        }

        try {
            const productos = await Producto.findAll({
                where: {
                    id_producto: {
                        [Op.in]: ids,
                    },
                },
            });

            res.json(Respuesta.exito(productos, "Productos obtenidos correctamente"));
        } catch (err) {
            console.error(err);
            res.status(500).json(Respuesta.error(null, "Error al obtener productos"));
        }
    }


    async getProductosByCategoria(req, res) {
  const id_categoria = Number(req.params.id_categoria);

  if(!Number.isInteger(id_categoria)) {
    return res.status(400).json(Respuesta.error(null, "ID de categoría inválido"));
  }

  try {
    const productos = await Producto.findAll({
      where: { id_categoria }
    });

    res.json(
      Respuesta.exito(productos, "Productos de la categoría")
    );
  } catch (err) {
    logMensaje("Error: " + err);
    res.status(500).json(
      Respuesta.error(null, "Error al obtener productos por categoria")
    );
  }
}

    

}

module.exports = new ProductoController();
