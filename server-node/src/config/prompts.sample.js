// ⚠️ NOTE TO VIEWERS:
// The actual prompts are stored securely and are not committed to this repository
// to prevent misuse. The following placeholders give you an idea of what they do.

export const RECIPE_GEN_PROMPT = `
[Placeholder Prompt]
This prompt tells the model to generate a recipe JSON
given a list of ingredients. It ensures the response
is structured, safe, and useful for displaying in the app.
`;

export const INGREDIENT_VALID_PROMPT = `
[Placeholder Prompt]
This prompt tells the model to validate a list of user inputs
and determine which are real edible ingredients vs invalid/harmful items.
It requires the response to be JSON so it can be parsed by the app.
`;
