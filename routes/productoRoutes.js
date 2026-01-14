const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.post('/', productoController.createProducto);
router.get('/', productoController.getAllProductos);
router.delete('/:id_producto', productoController.deleteProducto);
router.put('/:id_producto', productoController.updateProducto);
router.get('/:id_producto', productoController.getProductoById);
router.post('/favoritesProducts', productoController.getFavoritesProductsByIds);
router.get("/productos/categoria/:id_categoria", productoController.getProductosByCategoria);

/*router.get('/', categoriaController.getAllCategorias);
router.delete('/:id_categoria', categoriaController.deleteCategoria);
router.put('/:id_categoria', categoriaController.updateCategoria);
router.get('/:id_categoria', categoriaController.getCategoriaById);*/


module.exports = router;