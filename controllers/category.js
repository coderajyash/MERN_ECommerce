const Category =require("../models/category")



exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.staus(400).json({
                error:"Category Not Found in DB"
            })
        }
        req.category = cate

        next()
    })
}

exports.createCategory = (req,res)=>{
    const category = new Category(req.body);
    //Interacting with DB we get two stuff err,object
    category.save((err,category)=>{
        if(err){
            return res.staus(400).json({
                error:"Not Able to save Category in DB"
            })
        }
        res.json({category})
    })
}

exports.getCategory = (req,res) =>{
    return res.json(res.category)
}

exports.getAllCategory = (req,res) =>{
    //find does not have any parameter because we need all categories
    Category.find(),exec((err,items)=>{
        if(err){
            return res.staus(400).json({
                error:"No Category found"
            })
        }
        res.json(items)
    })
}

exports.updateCategory = (req,res)=>{
    //category in fo extracted because of middleware 
    const category = req.category
    category.name =req.body.name

    category.save((err,updatedCategory)=>{
        if(err){
            return res.staus(400).json({
                error:"Category Not Updated"
            })
        }
        res.json(updatedCategory)
    })
}


exports.removeCategory = (req,res)=>{
    const category = req.category

    category.remove((err,category)=>{
        if(err){
            return res.staus(400).json({
                error:"Failed to delete this category"
            })
        }
        res.json({
            message:"Successfully Deleted"
        })
    })
}