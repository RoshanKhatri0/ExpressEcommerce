const Category=require('../models/categoryModel')

exports.testFunction=(req,res)=>{
    res.send('This is from the category controller')
}

// to insert the catgeory
exports.postCategory=async(req,res)=>{
    let category=new Category({
        category_name:req.body.category_name
    })
    category = await category.save()
    if(!category){
        return res.status(400).json({error:'Someting went wrong'})
    }
    res.send(category)
}

//to retrieve all data
exports.categoryList=async(req,res)=>{
    const category = await Category.find()
    if(!category){
        return res.status(400).json({error:'Someting went wrong'})
    }
    res.send(category)
}

//to view category details
exports.categoryDetails=async(req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json({error:'Someting went wrong'})
    }
    res.send(category)
}
