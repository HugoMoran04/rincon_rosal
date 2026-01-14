const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedido', {
    id_pedido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    estado: {
      type: DataTypes.ENUM('pendiente','pagado','enviado','entregado','cancelado'),
      allowNull: false,
      defaultValue: "pendiente"
    },
    total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    anotaciones: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodo_pago',
        key: 'id_pago'
      }
    },
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'direccion_envio',
        key: 'id_direccion'
      }
    }
  }, {
    sequelize,
    tableName: 'pedido',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pedido" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
        name: "id_pago",
        using: "BTREE",
        fields: [
          { name: "id_pago" },
        ]
      },
      {
        name: "id_direccion",
        using: "BTREE",
        fields: [
          { name: "id_direccion" },
        ]
      },
    ]
  });
};
