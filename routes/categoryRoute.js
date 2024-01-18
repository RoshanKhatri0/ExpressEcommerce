const express = require('express')
const { testFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const router=express.Router()
const {categoryValidation,validation} = require('../validation/validator')
const { requireSignin, requireAdmin } = require('../controllers/userController')

router.get('/demo',testFunction)
router.post('/postcategory',requireSignin,requireAdmin,categoryValidation,validation,postCategory)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('/categoryupdate/:id',requireSignin,requireAdmin,categoryValidation,validation,updateCategory)
router.delete('/deletecategory/:id',requireSignin,requireAdmin,deleteCategory)


module.exports=router