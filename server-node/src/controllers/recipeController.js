// This file contains the core logic for handling requests.

import * as recipeService from "../services/recipeService.js";
import { getCache, setCache } from "../utils/cache.js";
/**
 * Controller function to handle the recipe generation request.
 * It extracts data from the request and calls the appropriate service.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    const validInputResponse = await recipeService.sanitizeIngredients(
      ingredients,
      res
    );
    console.log("Controller INPUT: ", validInputResponse);
    if (!validInputResponse.isValid) {
      return res.status(400).json({
        message: "Ingredients provided are not food or edible items.",
        invalidItems: validInputResponse.invalidItems,
      });
    }
    console.log(
      "Controller VALID INPUT: ",
      validInputResponse.cleanIngredients
    );
    const validInput = validInputResponse.cleanIngredients;
    const cached = getCache(validInput);
    if (cached) {
      return res.status(200).json({
        message: "Recipe fetched from cache successfully!",
        result: {
          recipe: cached,
        },
      });
    }
    const recipe = await recipeService.createRecipe(validInput);
    setCache(validInput, recipe, 600); // Cache for 10 minutes
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
