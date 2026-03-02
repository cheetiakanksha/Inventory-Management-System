import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  return sendSuccess(res, 201, "User registered successfully", user);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  return sendSuccess(res, 200, "Login successful", data);
});
