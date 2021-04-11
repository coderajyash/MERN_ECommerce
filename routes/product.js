const express = require("express")
const router = express.Router();

const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {getProductById,createProduct,getProduct, photo,updateProduct,deleteProduct,getAllProduct,getAllUniqueCategories} = require("../controllers/product")

//All of params
router.param("userId",getUserById)
router.param("productId",getProductById)




//All of actual Routes
//create routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)




//read routes
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)


//delete routes
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)


//update routes
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)


//listing routes
router.get("/products",getAllProduct)
router.get("/products.categories",getAllUniqueCategories)





module.exports = router;
