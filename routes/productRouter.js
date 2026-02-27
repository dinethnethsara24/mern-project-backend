import express from "express";
import { getProducts, searchProducts } from "../controllers/productController.js";
import { postProducts } from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";
import { updateProduct } from "../controllers/productController.js";
import { getproductbyId } from "../controllers/productController.js";   

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/add",postProducts);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId", updateProduct);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getproductbyId);



export default productRouter;

