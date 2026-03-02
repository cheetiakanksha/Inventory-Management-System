import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export const notFoundHandler = (_req, res) => {
  return sendError(res, 404, "Route not found");
};

export const errorHandler = (err, _req, res, _next) => {
  if (err?.statusCode) {
    return sendError(res, err.statusCode, err.message, err.details);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return sendError(res, 400, "Resource already exists");
    }
  }

  if (env.nodeEnv !== "test") {
    console.error(err);
  }

  return sendError(res, 500, "Internal server error");
};
