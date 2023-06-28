import express  from "express"; 
import asyncHandler from "express-async-handler"
import {admin, protect} from "../Middleware/AuthenMiddleware.js";
import Product from "../Models/ProductModel.js";

const productRoute = express.Router()


// GET ALL PRODUCTS
productRoute.get("/", asyncHandler(
    async(req,res) =>{
        const pageSize = 6
        const page = Number(req.query.pageNumber) || 1 
        const keyword = req.query.keyword ? {
            name:{
                $regex : req.query.keyword, 
                $options: "i"
            }
        } : {}
        const count = await Product.countDocuments({...keyword})
        const products = await Product.find({...keyword})
                        .limit(pageSize)
                        .skip(pageSize *(page-1))
                        .sort({_id:-1})
        res.json({ products,page,pages:Math.ceil(count/pageSize)})
        
    }
))

// ADMIN GET ALL PRODUCTS WITHOUT SEARCH AND PEGINATION
productRoute.get("/all",protect,admin,asyncHandler(async (req,res) => {
    const products = await Product.find({}).sort({_id:-1})
    res.json(products)
}))


// GET SINGLE PRODUCT

productRoute.get("/:id", 
    asyncHandler(async(req,res) =>{
        const product = await Product.findById(req.params.id)
        if(product)
        {
            res.json(product)

        }
        else
        {
            res.status(404)
            throw new Error("Product not Found")
           

        }
    }
))

// PRODUCT REVIEW

productRoute.post("/:id/review", protect,
    asyncHandler(async(req,res) =>{
        const {rating,comment} = req.body
        const product = await Product.findById(req.params.id)
        if(product)
        {
            const alredyReviewed = product.reviews.find((r)=>r.user.toString() === req.user._id.toString())
            if(alredyReviewed){
                res.status(400)
                throw new Error("Product already Reviewed")
            }
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user:req.user._id
            }
                product.reviews.push(review)
            product.numReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc,item)=>item.rating+acc,0) / product.reviews.length;
            await product.save()
            res.status(201).json({message:"Reviewes Added"})
        }
        else
        {
            res.status(404)
            throw new Error("Product not Found")
           

        }
    }
))

// DELETE PRODUCT

productRoute.delete("/:id",protect,admin,
    asyncHandler(async(req,res) =>{
        const product = await Product.findById(req.params.id)
        if(product)
        {
            await product.remove()
            res.json({message:"Product deleted"})

        }
        else
        {
            res.status(404)
            throw new Error("Product not Found")
           

        }
    }
))

// CREATE PRODUCT

productRoute.post("/",protect,admin,
    asyncHandler(async(req,res) =>{
        const {name,price,description,image,countInStock} = req.body
        const productExits = await Product.findOne({name})
        if(productExits)
        {
            res.status(400)
            throw new Error("Product name adready ")


        }
        else
        {
            const product  = new Product({name,price,description,image,countInStock,user:req.user._id})
           if(product) {
            const createProduct = await product.save()
            res.status(201).json(createProduct)
           }
           else{
            res.status(400)
            throw new Error("Invalid product data")
           }

        }
    }
))

// EDIT PRODUCT
productRoute.put("/:id",protect,admin,
    asyncHandler(async(req,res) =>{
        const {name,price,description,image,countInStock} = req.body
        const product = await Product.findById(req.params.id)
        if(product)
        {
            product.name=name;
            product.price=price;
            product.description=description;
            product.image=image;
            product.countInStock=countInStock;
            const updateProduct = await product.save()
            res.json(updateProduct)
        }
        else{

            res.status(404)
            throw new Error("product not found")
        }
    }
))

export default productRoute
