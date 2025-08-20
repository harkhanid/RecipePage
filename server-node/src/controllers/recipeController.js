// This file contains the core logic for handling requests.
import { CustomError } from "../utils/customError.js";
import * as recipeService from "../services/recipeService.js";
import { getCache, setCache } from "../utils/cache.js";

/**
 * Controller function to handle the recipe generation request.
 * It extracts data from the request and calls the appropriate service.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const generateRecipe = async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    // const validInputResponse = await recipeService.sanitizeIngredients(
    //   ingredients
    // );
    // if (!validInputResponse.isValid) {
    //   throw new CustomError("Unsafe ingredients detected.", 400, {
    //     blockedItems: validInputResponse.invalidItems,
    //   });
    // }

    // const validInput = validInputResponse.cleanIngredients;
    const validInput = ingredients; // Assuming ingredients are already sanitized
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
    next(error);
  }
};
