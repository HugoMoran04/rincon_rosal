const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getAllUsuarios);
router.delete('/:id_usuario', usuarioController.deleteUsuario);
router.put('/:idusuario', usuarioController.updateUsuario);

router.post('/login' , usuarioController.loginUsuario);

module.exports = router;

