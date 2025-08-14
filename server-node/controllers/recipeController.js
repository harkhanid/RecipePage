// This file contains the core logic for handling requests.

import * as receipeService from "../services/recipeService.js";
import { getCache, setCache } from "../cache.js";
/**
 * Controller function to handle the recipe generation request.
 * It extracts data from the request and calls the appropriate service.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    santizeInput(ingredients);
    const cached = getCache(ingredients);
    if (cached) {
      return res.status(200).json({
        message: "Recipe fetched from cache successfully!",
        result: {
          recipe: cached,
        },
      });
    }
    const recipe = await receipeService.createRecipe(ingredients);
    setCache(ingredients, recipe, 600); // Cache for 10 minutes
    res.status(200).json({
      message: "Recipe generated successfully!",
      result: {
        recipe: recipe,
      },
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
