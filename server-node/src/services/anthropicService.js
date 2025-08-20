import Anthropic from "@anthropic-ai/sdk";

const RECIPE_GEN_PROMPT = process.env.RECIPE_GEN_PRE_PROMPT;

const INGREDIENT_VALID_PROMPT = process.env.INGREDIENT_VALID_PRE_PROMPT;
/**
 * Service function to create a recipe.
 * In a real application, this is where you would call the LLM API.
 * @param {string[]} ingredients - An array of ingredients.
 * @returns {object} - The generated recipe object.
 */
export const generateRecipe = async (ingredients) => {
  const anthropic = new Anthropic();
  // --- Placeholder Logic ---
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    temperature: 0,
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
  const anthropic = new Anthropic();
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

export const moderateText = async (text) => {
  const anthropic = new Anthropic();
  const response = await anthropic.moderations.create({
    model: "claude-moderation-latest",
    input: text,
  });
  return response?.results?.[0]?.flagged ?? false; // true if unsafe
};
