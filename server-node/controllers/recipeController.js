// This file contains the core logic for handling requests.

import * as receipeService from "../services/recipeService.js";

/**
 * Controller function to handle the recipe generation request.
 * It extracts data from the request and calls the appropriate service.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const generateRecipe = async (req, res) => {
  try {
    // 1. Get the ingredients from the request body
    const { ingredients } = req.body;

    // 2. Call the service layer to handle the business logic
    santizeInput(ingredients);
    const recipe = await receipeService.createRecipe(ingredients);
    res.status(200).json({
      message: "Recipe generated successfully!",
      recipe: recipe,
    });
  } catch (error) {
    // 5. Handle any errors that occur
    res.status(500).json({
      message: "An error occurred while generating the recipe.",
      error: error.message,
    });
  }
};

const santizeInput = (ingredients) => {
  ingredients = [...new Set(ingredients.map((i) => i.toLowerCase().trim()))];
  ingredients = ingredients.filter((i) => i.length > 0);
  // Limit to reasonable length (e.g., 15 items)
  if (ingredients.length > 15) {
    ingredients = ingredients.slice(0, 15);
  }
  return ingredients;
};
