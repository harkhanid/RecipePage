// This file contains the core logic for handling requests.
import { CustomError } from "../utils/customError.js";
import * as recipeService from "../services/recipeService.js";
import { getCache, setCache } from "../utils/cache.js";
import { logger } from "../utils/logger.js";
/**
 * Controller function to handle the recipe generation request.
 * It extracts data from the request and calls the appropriate service.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const generateRecipe = async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    const validInputResponse = await recipeService.sanitizeIngredients(
      req.requestId,
      ingredients
    );
    if (!validInputResponse.isValid) {
      logger.error(
        { requestId: req.requestId },
        `recipeController:Unsafe ingredient attempt, Ingredients: ${validInputResponse.invalidItems}`
      );
      throw new CustomError("Unsafe ingredients detected.", 400, {
        blockedItems: validInputResponse.invalidItems,
      });
    }

    const validInput = validInputResponse.cleanIngredients;
    // const validInput = ingredients; // Assuming ingredients are already sanitized
    logger.info(
      { requestId: req.requestId, ingredients: ingredients },
      "recipeController:generateRecipe::Valid:" + validInputResponse.isValid
    );
    const cached = getCache(validInput);

    if (cached) {
      return res.status(200).json({
        message: "Recipe fetched from cache successfully!",
        result: {
          recipe: cached,
        },
      });
    }
    const recipe = await recipeService.createRecipe(validInput, req.requestId);

    logger.info(
      { requestId: req.requestId, ingredients: ingredients },
      "recipeController:generateRecipe::Recipe generated successfully." +
        recipe.title
    );
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
