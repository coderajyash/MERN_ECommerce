const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")//file system
const { sortBy } = require("lodash")


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found"
                })
            }
            req.product = product
            next()
        })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with Image"
            })
        }
        //destructure the fields
        const { name, description, price, category, stock } = fields

        //Restriction on fields
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all fields"
            })
        }


        let product = new Product(fields)

        //Handling the file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File Size bigger than 3 MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Saving Tshirt in DB Failed"
                })
            }
            res.json(product)
        })
    })
}


exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//load photo in background
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//delete controller
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the Product"
            })
        }
        res.json({
            message: "Deletion was a Success",
            deletedProduct
        })
    })
}


//update controller
//Products info will be pulled from database then user will perform changes in the product then hit save
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with Image"
            })
        }
        //Updation code
        let product = req.product
        product = _.extend(product, fields)
        //Handling the file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File Size bigger than 3 MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Updation of product in DB Failed"
                })
            }
            res.json(product)
        })
    })
}


exports.getAllProduct = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 50
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
        .select("-photo")//donst select photo
        .populate("category")//Review Populate
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No Product Found"
                })
            }
            res.json(products)
        })
}

//Update Inventory on every order
//Middleware
exports.updateStock = (req, res, next) => {
    let myOperation = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }//from frontend
            }
        }
    })
    Product.bulkWrite(myOperation, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk Operation Failed"
            })
        }
        next()
    })
}

//
exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json(
                {
                    error: "No Category Found"
                }
            )
        }
        res.json(category)
    })
}
