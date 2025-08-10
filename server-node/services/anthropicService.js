import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe 
they could make with some or all of those ingredients. You don't need to use every ingredient 
they mention in your recipe. The recipe can include additional ingredients they didn't mention, 
but try not to include too many extra ingredients. 
Give me 3 short, effective search terms for finding a high-quality photo of recipe on a stock photo website. Prioritize the most specific term first.
MUST:Format your response in JSON with the following structure:
{
  "title": [Recipe Title],
  "description": [2-3 sentence description of the recipe.],
  "image": [search term 1, search term 2, search term 3],
  "ingredients": [
    {
      "name": [Ingredient Name],
      "quantity": [Quantity, e.g., "2 cups", "1 tablespoon"],
      "optional": [true/false]
    },
    // Repeat for each ingredient
  ],
  "preparation_time": {
    "total": [Total preparation time in minutes],
    "prep": [Preparation time in minutes],
    "cook": [Cooking time in minutes]
  },
  "instructions": [Array of step-by-step instructions],
  "Nutrition": {
    "calories": [Calories per serving],
    "protein": [Protein content in grams],
    "carbohydrates": [Carbohydrates content in grams],
    "fat": [Fat content in grams]
  },
}`;

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
    temperature: 1,
    system: SYSTEM_PROMPT,
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
