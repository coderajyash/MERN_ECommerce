var express = require("express");
const { check } = require("express-validator");
var router = express.Router();

const {signout,signup,signin,isSignedIn} = require("../controllers/auth")

router.post("/signup",[
    check("name","Name Should Be atleast 3 characters").isLength({ min: 3 }),
    check("email","Email format invalid").isEmail(),
    check("password","Password  Should Be atleast 3 characters").isLength({min:3})
],signup)

router.post("/signin",[
    check("email","Email format invalid").isEmail(),
    check("password","Password is required").isLength({min:3})
],signin)

router.get("/signout",signout)


router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.auth)
})



module.exports = router;

