const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');

router.post('/', favoritosController.createFavorito);
router.get('/', favoritosController.getAllFavoritos);
router.delete('/:id_favorito', favoritosController.deleteFavorito);
//router.put('/:id_favorito', favoritosController.updateFavorito);
router.get('/usuario/:id_usuario', favoritosController.getFavoritosByUsuario);
module.exports = router;