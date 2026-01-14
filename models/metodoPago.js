const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('metodoPago', {
    id_pago: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tipo_pago: {
      type: DataTypes.ENUM('Contrarembolso','PayPal','Google Pay','Tarjeta Credito/Debito','Apple Pay'),
      allowNull: false
    },
    anotaciones: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'metodo_pago',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pago" },
        ]
      },
    ]
  });
};
