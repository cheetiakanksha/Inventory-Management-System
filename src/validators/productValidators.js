import { body, param } from "express-validator";

export const productIdParamValidator = [
  param("id").isUUID().withMessage("Invalid product id"),
];

export const createProductValidator = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters")
    .escape(),
  body("sku")
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9_-]{3,40}$/)
    .withMessage("SKU must be 3-40 characters and only include letters, numbers, _ or -"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0")
    .toFloat(),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be an integer greater than or equal to 0")
    .toInt(),
  body("description")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .escape(),
];

export const updateProductValidator = [
  param("id").isUUID().withMessage("Invalid product id"),
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters")
    .escape(),
  body("sku")
    .optional()
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9_-]{3,40}$/)
    .withMessage("SKU must be 3-40 characters and only include letters, numbers, _ or -"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0")
    .toFloat(),
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be an integer greater than or equal to 0")
    .toInt(),
  body("description")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .escape(),
  body().custom((payload) => {
    const allowedFields = ["name", "sku", "price", "quantity", "description"];
    const providedFields = Object.keys(payload);

    if (providedFields.length === 0) {
      throw new Error("At least one field is required for update");
    }

    const hasInvalidField = providedFields.some((field) => !allowedFields.includes(field));
    if (hasInvalidField) {
      throw new Error("Request contains invalid fields");
    }

    return true;
  }),
];
