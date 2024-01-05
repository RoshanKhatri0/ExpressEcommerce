const express = require('express')
const { testFunction, postCategory, categoryList } = require('../controllers/categoryController')
const router=express.Router()

router.get('/demo',testFunction)
router.post('/postcategory',postCategory)
router.get('/categorylist',categoryList)


module.exports=router