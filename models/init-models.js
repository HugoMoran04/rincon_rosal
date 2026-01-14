var DataTypes = require("sequelize").DataTypes;
var _categoria = require("./categoria");
var _detallePedido = require("./detallePedido");
var _direccionEnvio = require("./direccionEnvio");
var _metodoPago = require("./metodoPago");
var _pedido = require("./pedido");
var _producto = require("./producto");
var _usuarios = require("./usuarios");
var _favoritos = require("./favoritos");

function initModels(sequelize) {
  var categoria = _categoria(sequelize, DataTypes);
  var detallePedido = _detallePedido(sequelize, DataTypes);
  var direccionEnvio = _direccionEnvio(sequelize, DataTypes);
  var metodoPago = _metodoPago(sequelize, DataTypes);
  var pedido = _pedido(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var favoritos = _favoritos(sequelize, DataTypes);

  producto.belongsTo(categoria, { /*as: "id_categoria_categorium",*/as:"categoria", foreignKey: "id_categoria"});
  categoria.hasMany(producto, { as: "productos", foreignKey: "id_categoria"});
  pedido.belongsTo(direccionEnvio, { as: "id_direccion_direccion_envio", foreignKey: "id_direccion"});
  direccionEnvio.hasMany(pedido, { as: "pedidos", foreignKey: "id_direccion"});
  pedido.belongsTo(metodoPago, { as: "id_pago_metodo_pago", foreignKey: "id_pago"});
  metodoPago.hasMany(pedido, { as: "pedidos", foreignKey: "id_pago"});
  detallePedido.belongsTo(pedido, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedido.hasMany(detallePedido, { as: "detalle_pedidos", foreignKey: "id_pedido"});
  detallePedido.belongsTo(producto, { as: "id_producto_producto", foreignKey: "id_producto"});
  producto.hasMany(detallePedido, { as: "detalle_pedidos", foreignKey: "id_producto"});
  direccionEnvio.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(direccionEnvio, { as: "direccion_envios", foreignKey: "id_usuario"});
  pedido.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(pedido, { as: "pedidos", foreignKey: "id_usuario"});

  favoritos.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(favoritos, { as: "favoritos", foreignKey: "id_usuario"});
  favoritos.belongsTo(producto, { as: "id_producto_producto", foreignKey: "id_producto"});
  producto.hasMany(favoritos, { as: "favoritos", foreignKey: "id_producto"});

  return {
    categoria,
    detallePedido,
    direccionEnvio,
    metodoPago,
    pedido,
    producto,
    usuarios,
    favoritos,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
