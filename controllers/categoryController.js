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

//to update category
exports.updateCategory=async(req,res)=>{
    const category= await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name:req.body.category_name
        },
        {new:true}
    )
    if(!category){
        return res.status(400).json({error:'Someting went wrong'})
    }
    res.send(category)
}

//to delete category
exports.deleteCategory=(req,res)=>{
    Category.findByIdAndDelete(req.params.id)
    .then(category=>{
        if(!category){
        return res.status(404).json({error:'category with that id is not found'})
    }
    else{
        return res.status(200).json({message:'category deleted'})
    }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
    
}