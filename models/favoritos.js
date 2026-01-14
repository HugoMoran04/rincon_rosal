const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "favoritos",
    {
      id_favorito: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
      },
      id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "producto",
          key: "id_producto",
        },
      },
    },
    {
      sequelize,
      tableName: "favoritos",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_favorito" }],
        },
        {
          name: "id_usuario",
          using: "BTREE",
          fields: [{ name: "id_usuario" }],
        },
        {
          name: "id_producto",
          using: "BTREE",
          fields: [{ name: "id_producto" }],
        },
      ],
    }
  );
};
