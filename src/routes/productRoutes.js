import { Router } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProduct,
  listProducts,
  updateProductHandler,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createProductValidator,
  productIdParamValidator,
  updateProductValidator,
} from "../validators/productValidators.js";

export const productRouter = Router();

productRouter.use(authenticate);

productRouter.get("/", listProducts);
productRouter.get("/:id", productIdParamValidator, validateRequest, getProduct);
productRouter.post("/", createProductValidator, validateRequest, createProductHandler);
productRouter.patch("/:id", updateProductValidator, validateRequest, updateProductHandler);
productRouter.delete("/:id", productIdParamValidator, validateRequest, deleteProductHandler);
