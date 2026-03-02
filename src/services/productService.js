import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const productSelect = {
  id: true,
  name: true,
  sku: true,
  price: true,
  quantity: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price),
});

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: productSelect,
  });

  return products.map(normalizeProduct);
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return normalizeProduct(product);
};

export const createProduct = async (payload) => {
  const existingSku = await prisma.product.findUnique({ where: { sku: payload.sku } });
  if (existingSku) {
    throw new ApiError(400, "Product with this SKU already exists");
  }

  const product = await prisma.product.create({
    data: payload,
    select: productSelect,
  });

  return normalizeProduct(product);
};

export const updateProduct = async (id, payload) => {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  if (payload.sku && payload.sku !== existingProduct.sku) {
    const duplicateSku = await prisma.product.findUnique({ where: { sku: payload.sku } });
    if (duplicateSku) {
      throw new ApiError(400, "Product with this SKU already exists");
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: payload,
    select: productSelect,
  });

  return normalizeProduct(product);
};

export const deleteProduct = async (id) => {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  await prisma.product.delete({ where: { id } });
};
