const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts); 
router.get('/add', productController.getAddForm);
router.post('/add', productController.upload, productController.addProduct);
router.get('/edit/:id', productController.getEditForm);
router.post('/edit/:id', productController.upload, productController.updateProduct);
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;