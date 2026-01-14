// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);

const Pedido = models.pedido;
const DetallePedido = models.detallePedido;
const Producto = models.producto;

class PedidoController {
    // Método para crear un nuevo pedido con sus detalles
    async createPedido(req, res) {
        const { id_usuario, id_direccion,carrito, id_pago = 6 } = req.body;
        try {
             if (!id_usuario || !id_direccion || !carrito || carrito.length === 0) {
        return Respuesta.error(res, "Datos incompletos", 400);
        }
        const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);

         const nuevoPedido = await Pedido.create({
        id_usuario,
        id_direccion,
        id_pago,
        total,
        estado: 'pagado', // compra directa
        anotaciones: ''
      });

       // Crear detalles del pedido
      const detalles = carrito.map(item => ({
        id_pedido: nuevoPedido.id_pedido,
        id_producto: item.id_producto,
        unidades: item.quantity,
        precio: item.price,
        total: item.price * item.quantity,
        anotaciones: item.anotaciones || ''
      }));

      await DetallePedido.bulkCreate(detalles);
       // Traer pedido completo con detalles y producto
      const pedidoConDetalles = await Pedido.findOne({
        where: { id_pedido: nuevoPedido.id_pedido },
        include: [
          {
            model: DetallePedido,
            as: "detalle_pedidos",
            include: [{ model: Producto, as: "id_producto_producto" }]
          }
        ]
      });
       logMensaje(`Pedido creado: ${nuevoPedido.id_pedido}`);
      return Respuesta.exito(res, pedidoConDetalles, "Pedido creado correctamente");

    }catch (error) {
      logMensaje(`Error comprar: ${error.message}`);
      return Respuesta.error(res, "Error al crear el pedido", 500);
    }
}
async getPedidosByUsuario(req, res) {
    const { id_usuario } = req.params;
    try {
      const pedidos = await Pedido.findAll({
        where: { id_usuario },
        include: [
          {
            model: DetallePedido,
            as: "detalle_pedidos",
            include: [{ model: Producto, as: "id_producto_producto" }]
          }
        ],
        order: [['fecha_pedido', 'DESC']]
      });
      return Respuesta.exito(res, pedidos, "Pedidos del usuario");
    } catch (error) {
      logMensaje(`Error misPedidos: ${error.message}`);
      return Respuesta.error(res, "Error al obtener los pedidos", 500);
    }
  }

   async getAllPedidos(req, res) {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          {
            model: DetallePedido,
            as: "detalle_pedidos",
            include: [{ model: Producto, as: "id_producto_producto" }]
          }
        ],
        order: [['fecha_pedido', 'DESC']]
      });
      return Respuesta.exito(res, pedidos, "Todos los pedidos");
    } catch (error) {
      logMensaje(`Error todosPedidos: ${error.message}`);
      return Respuesta.error(res, "Error al obtener todos los pedidos", 500);
    }
  }


}
module.exports = new PedidoController();