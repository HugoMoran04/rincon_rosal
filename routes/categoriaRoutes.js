const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.post('/', categoriaController.createCategoria);
router.get('/', categoriaController.getAllCategorias);

router.get("/con-productos", categoriaController.getCategoriasConProductos);

router.delete('/:id_categoria', categoriaController.deleteCategoria);
router.put('/:id_categoria', categoriaController.updateCategoria);
router.get('/:id_categoria', categoriaController.getCategoriaById);




module.exports = router;