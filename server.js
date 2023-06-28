import express from "express"
import products from "./data/Products.js"
import dotenv from "dotenv"
import connectDatabase from "./config/MogoDb.js"
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import {notFound,errorHandler} from "./Middleware/Errors.js"
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";
import cors from "cors"

dotenv.config();
connectDatabase();


const app = express()
app.use(express.json());
app.use(cors())




// API
app.use("/api/import",ImportData)
app.use("/api/products",productRoute)
app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)
app.get("/api/config/paypal",(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID)
})



// ERROR HANDLER
app.use(notFound)
app.use(errorHandler)


// // LOAD PRODUCT FROM SERVER
// app.get("/api/products",(req,res)=>{
//     res.json(products)
// })

// // SINGLE PRODUCT FROM SERVER
// app.get("/api/products/:id",(req,res)=>{
//     const product = products.find((p) => p._id === req.params.id);
//     res.json(product)

    
    
// })




app.get("/",(req,res)=>{
    res.send("API is running...")
})

const PORT = process.env.PORT || 1000;

app.listen(PORT,console.log(`Sever running in port  ${PORT}`))