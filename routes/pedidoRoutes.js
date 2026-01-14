const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.createPedido);
router.get('/', pedidoController.getAllPedidos);
router.get('/usuario/:id_usuario', pedidoController.getPedidosByUsuario);


module.exports = router;