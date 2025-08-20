import Anthropic from "@anthropic-ai/sdk";
import {
  INGREDIENT_VALID_PROMPT,
  RECIPE_GEN_PROMPT,
} from "../config/prompts.js";

const anthropic = new Anthropic();

/**
 * Service function to create a recipe.
 * In a real application, this is where you would call the LLM API.
 * @param {string[]} ingredients - An array of ingredients.
 * @returns {object} - The generated recipe object.
 */
export const generateRecipe = async (ingredients) => {
  // --- Placeholder Logic ---
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    temperature: 1,
    system: RECIPE_GEN_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Here are some ingredients I have: ${ingredients.join(
              ", "
            )}. Can you suggest a recipe?`,
          },
        ],
      },
    ],
  });
  return msg;
};

export const validateIngredients = async (untrustedIngredients) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    temperature: 0.2,
    system: INGREDIENT_VALID_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Ingredients to validate: ${untrustedIngredients.join(", ")}`,
          },
        ],
      },
    ],
  });
  return msg;
};
