const express=require('express')
const { postProduct, productList, productDetail, updateProduct, deleteProduct } = require('../controllers/productController')
const router=express.Router()
const upload=require('../middleware/fileUpload')

router.post('/postproduct',upload.single('product_image'),postProduct)
router.get('/productlist',productList)
router.get('/productdetail/:id',productDetail)
router.put('/productupdate/:id',upload.single('product_image'),updateProduct)
router.delete('/productdelete/:id',deleteProduct)


module.exports=router