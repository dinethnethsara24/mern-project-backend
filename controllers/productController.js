import Product from '../models/product.js';
import { isAdmin } from './userController.js';


export async function getProducts(req, res) {


    try {

        if (isAdmin(req)) {
            const product = await Product.find()
            res.json(product);
        } else {
            const product = await Product.find({ isAvailable: true });
            res.json(product);
        }


    } catch (err) {

        res.status(500).json({
            message: "Failed to get products",
            error: err

        })

    }
}


export function postProducts(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "User not authorized to add products"
            }

        )

        return
    }


    const product = new Product(req.body);

    product.save().then(() => {
        res.json({
            message: "Product added successfully"
        })
    }).catch((err) => {
        res.json({
            message: "Product added failed",
            error: err
        })
    })
}


export async function deleteProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "User not authorized to delete products"
            }
        )

        return
    }

    try {
        await Product.deleteOne({ productId: req.params.productId })

        res.json({
            message: "Product deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: "Product deletion failed",
            error: err
        })
    }
}


export async function updateProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "User not authorized to update products"
            }
        )
        return
    }


    const productId = req.params.productId
    const updatingData = req.body

    try {

        await Product.updateOne(
            { productId: productId },
            updatingData

        )

        res.json({
            message: "Product updated successfully",

        })


    } catch (err) {

        res.status(500).json(
            {
                message: "Product update failed",
                error: err.message
            }
        )

    }
}


export async function getproductbyId(req, res) {

    const productId = req.params.productId;

    try {


        const product = await Product.findOne({ productId: productId });

        if (product == null) {
            res.status(404).json({
                message: "Product not found"
            })

            return

        } else {

            if (product.isAvailable) {
                res.json(product);
            } else {
                if (!isAdmin(req)) {
                    res.status(403).json({
                        message: "product not found"
                    })
                    return

                } else {
                    res.json(product);
                }
            }


        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to get product",
            error: err
        })
    }
}


export async function searchProducts(req,res){
    const searchQuery = req.params.query
    try{
        const products = await Product.find({
            $or:[
                {productName :  {$regex : searchQuery, $options : "i"}},
                {altNames : {$elemMatch : {$regex : searchQuery, $options : "i"}}}
            ],
            isAvailable : true
        })
        res.json(products)
    }catch(err){
        res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }
}
