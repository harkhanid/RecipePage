// This file defines the specific endpoints for the /recipes route.

import express from "express";
import { generateRecipe } from "../controllers/recipeController.js";
import { verifyRecaptcha } from "../middleware/middleware.js";

const recipeRoutes = express.Router();

// Define the route for generating a recipe.
// POST /api/recipes/generate
recipeRoutes.post("/generate", generateRecipe);

export default recipeRoutes;
