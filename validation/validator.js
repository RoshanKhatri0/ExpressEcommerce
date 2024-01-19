const {check,validationResult} = require('express-validator')

exports.categoryValidation=[
    check('category_name','category is required').notEmpty()
    .isLength({min:3}).withMessage('category name must be atleast 3 characters')
]

exports.productValidation=[
    check('product_name','product name is required').notEmpty()
    .isLength({min:3}).withMessage('product name must be atleast 3 characters'),
    check('product_price','price is required').notEmpty()
    .isNumeric().withMessage('price must be a numeric value'),
    check('countInStock','stock is required').notEmpty()
    .isNumeric().withMessage('count of stock must be a numeric value'),
    check('product_description','description is required').notEmpty()
    .isLength({min:20}).withMessage('product name must be atleast 20 characters'),
    check('category','category is required').notEmpty()

]

exports.userValidation=[
    check('name','name is required').notEmpty()
    .isLength({min:3}).withMessage('name must be atleast 3 characters'),
    check('email','email is required').notEmpty()
    .isEmail().withMessage('email format incorrect'),
]

exports.passwordValidation=[
    check('password','password is mandatory').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain one lowercase character')
    .matches(/[A-Z]/).withMessage('password must contain one uppercase character')
    .matches(/[0-9]/).withMessage('password must contain one numeric character')
    .matches(/[@#$_?!]/).withMessage('password must contain special character')
    .isLength({min:8}).withMessage('password must be of minimun 8 characters')
]

exports.validation=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
}