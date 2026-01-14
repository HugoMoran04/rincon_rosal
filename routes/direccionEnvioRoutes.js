const express = require('express');
const router = express.Router();
const direccionEnvioController = require('../controllers/direccionEnvioController');

router.post('/:idusuario', direccionEnvioController.createDireccionEnvio);
router.get('/:idusuario', direccionEnvioController.getDireccionesByUser);
router.delete('/:idusuario/:iddireccion', direccionEnvioController.deleteDireccionEnvio);
router.put('/:idusuario', direccionEnvioController.updateDireccionEnvio);
module.exports = router;