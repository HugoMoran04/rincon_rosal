// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);

const Categoria = models.categoria;
const Producto = models.producto;

class CategoriaController {
  // Crear una nueva categoria
  async createCategoria(req, res) {
    const categoria = req.body;
    try {
      const nuevaCategoria = await Categoria.create(categoria);
      res.status(201).json(Respuesta.exito(nuevaCategoria, "Categoria creada"));
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(null, `Error al crear la categoria: ${categoria}`)
        );
    }
  }
  // Obtener todas las categorias
  async getAllCategorias(req, res) {
    try {
      const data = await Categoria.findAll();
      res.json(Respuesta.exito(data, "Datos de todas las categorias"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar las categorias: ${req.originalUrl}`
          )
        );
    }
  }
  // Eliminar una categoria por id
  async deleteCategoria(req, res) {
    const id_categoria = parseInt(req.params.id_categoria);
    try {
      console.log("Intentando eliminar categoria:", id_categoria);
      const numFilas = await Categoria.destroy({
        where: { id_categoria: id_categoria },
      });
      if (numFilas === 0) {
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Categoria con id ${id_categoria} no encontrada`
            )
          );
      } else {
        res.json(
          Respuesta.exito(null, `Categoria con id ${id_categoria} eliminada`)
        );
      }
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar la categoria ${req.originalUrl}`
          )
        );
    }
  }
  // Actualizar una categoria por id
  async updateCategoria(req, res) {
    const categoria = req.body;
    const id_categoria = req.params.id_categoria;

    if (id_categoria != categoria.id_categoria) {
      return res
        .status(400)
        .json(
          Respuesta.error(
            null,
            `El id de la categoria en la URL no coincide con el del cuerpo`
          )
        );
    }
    try {
      const numFilas = await Categoria.update(
        { ...categoria },
        { where: { id_categoria } }
      );
      if (numFilas[0] === 0) {
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Categoria con id ${id_categoria} no encontrada`
            )
          );
      } else {
        res.json(
          Respuesta.exito(null, `Categoria con id ${id_categoria} actualizada`)
        );
      }
    } catch (err) {
      logMensaje("Error: " + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar la categoria ${req.originalUrl}`
          )
        );
    }
  }
    // Obtener una categoria por id
    async getCategoriaById(req, res) {
        const id_categoria = Number(req.params.id_categoria);
        if (!Number.isInteger(id_categoria)) {
    return res.status(400).json({ error: "ID de categoría inválido" });
}
        try {
            const categoria = await Categoria.findByPk(id_categoria);
            if (categoria) {
                res.json(Respuesta.exito(categoria, `Categoria con id ${id_categoria} encontrada`));
            } else {
                res.status(404).json(Respuesta.error(null, `Categoria con id ${id_categoria} no encontrada`));
            }
        } catch (err) {
            logMensaje("Error: " + err);
            res.status(500).json(Respuesta.error(null, `Error al recuperar la categoria ${req.originalUrl}`));
        }
    }

/*
    async getCategoriasConProductos(req, res) {
  try {
   
    const categorias = await Categoria.findAll({
      include: [{
        model: Producto,
        as: 'productos',
       // where: { id_categoria: { [sequelize.Sequelize.Op.ne]: null } }, // 👈 Filtrar solo categorias con productos
       // required: true, // 👈 SOLO categorias con productos
      }],
      
    });
    console.log(JSON.stringify(categorias, null, 2));

    const categoriasConProductos = categorias.filter(cat => cat.productos.length > 0);

    res.json(Respuesta.exito(categorias, "Categorias con productos"));
  } catch (err) {
    console.error("Error Sequelize:", err); // 🔥 imprime el error real
    logMensaje("Error: " + err);
    res.status(500).json(
      Respuesta.error(null, "Error al obtener categorias con productos")
    );
  }
}*/

async getCategoriasConProductos(req, res) {
   console.log("👉 Entrando en getCategoriasConProductos");
   console.log(req.originalUrl)

  try {
    // Trae todas las categorías con sus productos
    const categorias = await Categoria.findAll({
      attributes: ['id_categoria', 'nombre'],
      include: [{
        model: Producto,
        as: 'productos', // coincide con tu hasMany
        attributes: ['id_producto', 'nombre', 'precio', 'imagen'], // solo lo necesario
        required:true,
      }],
      
      /*order: [
        ['id_categoria', 'ASC'],
        [{ model: Producto, as: 'productos' }, 'id_producto', 'ASC'],
      ],*/
    });

    return res.json(Respuesta.exito(categorias, "Categorias con productos"));

    //res.json(Respuesta.exito(categoriasConProductos, "Categorias con productos"));
  } catch (err) {
    console.error("🔥 ERROR REAL:", err);
   return  res.status(500).json(
      Respuesta.error(null, "Error al recuperar la categoria /api/categorias/con_productos")
    );
  }
}

}

module.exports = new CategoriaController();
