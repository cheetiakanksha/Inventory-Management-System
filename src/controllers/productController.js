import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../services/productService.js";

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await getAllProducts();
  return sendSuccess(res, 200, "Products fetched successfully", products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  return sendSuccess(res, 200, "Product fetched successfully", product);
});

export const createProductHandler = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  return sendSuccess(res, 201, "Product created successfully", product);
});

export const updateProductHandler = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  return sendSuccess(res, 200, "Product updated successfully", product);
});

export const deleteProductHandler = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  return sendSuccess(res, 200, "Product deleted successfully");
});
