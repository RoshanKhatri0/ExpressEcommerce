const express=require('express')
const { postProduct, productList, productDetail, updateProduct, deleteProduct } = require('../controllers/productController')
const router=express.Router()

router.post('/postproduct',postProduct)
router.get('/productlist',productList)
router.get('/productdetail/:id',productDetail)
router.put('/productupdate/:id',updateProduct)
router.delete('/productdelete/:id',deleteProduct)


module.exports=router