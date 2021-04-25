require("dotenv").config()
const mongoose = require('mongoose');
const express = require("express")
const app = express();
var cookieParser = require('cookie-parser')
var cors =require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors());



//My Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")




//if connecting to atlas then the url strng will be from there



mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("DB is Connected")
})
.catch(err=>{
   console.log(err)
});
//To use mysql install mysql package from npm 



//My routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)




//To deploy the app on the web we need to make changes to th port as
//const port = process.env.PORT || 8000;

const port = process.env.PORT || 8000;

//Middlewares express.json instead of bidy parser



app.listen(port, () => {
    console.log(`app is running at ${port}`)
})

