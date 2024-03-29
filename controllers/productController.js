const Product = require('../models/productModel')

//To insert details of product
exports.postProduct=async(req,res)=>{
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInStock: req.body.countInStock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category:req.body.category
    })
    product = await product.save() 
    if (!product){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(product)
}

//to get data of all product
exports.productList=async(req,res)=>{
    const product =await Product.find()
    .populate('category','category_name')
    if (!product){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(product)
}

//to get individual data of product
exports.productDetail=async(req,res)=>{
    const product =await Product.findById(req.params.id)
    .populate('category','category_name')
    if(!product){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(product)
}

//to update data of product
exports.updateProduct=async(req,res)=>{
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            countInStock: req.body.countInStock,
            product_description: req.body.product_description,
            product_image: req.file.path,
            category:req.body.category
        },
        {new:true}
    )
    if(!product){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(product)
}

//to delete data of product
exports.deleteProduct=(req,res)=>{
    Product.findByIdAndDelete(req.params.id)
    .then(product=>{
        if(!product){
            res.status(404).json({error:'product with tis id is not found'})        
        }
        else{
            return res.status(200).json({message:'product deleted'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
    
}