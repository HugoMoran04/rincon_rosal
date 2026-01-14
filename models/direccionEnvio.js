const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('direccionEnvio', {
    id_direccion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    provincia: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    observaciones: {
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
    }
  }, {
    sequelize,
    tableName: 'direccion_envio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_direccion" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
};
