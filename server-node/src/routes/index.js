// This file acts as a central hub for all other route files.

import express from "express";
import recipeRoutes from "./recipeRoutes.js";

const router = express.Router();

// All routes related to recipes will be prefixed with /recipes
router.use("/recipes", recipeRoutes);

// You can add other routers here as your application grows
// For example: router.use('/users', userRoutes);

export default router;
