const express=require('express')
const { postProduct, productList, productDetail, updateProduct, deleteProduct } = require('../controllers/productController')
const router=express.Router()
const upload=require('../middleware/fileUpload')
const {productValidation,validation} = require('../validation/validator')


router.post('/postproduct',upload.single('product_image'),productValidation,validation,postProduct)
router.get('/productlist',productList)
router.get('/productdetail/:id',productDetail)
router.put('/productupdate/:id',upload.single('product_image'),productValidation,validation,updateProduct)
router.delete('/productdelete/:id',deleteProduct)


module.exports=router