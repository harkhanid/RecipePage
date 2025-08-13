import { generateRecipe } from "../services/anthropicService.js";
import { createApi } from "unsplash-js";

/**
 * Service function to create a recipe.
 * In a real application, this is where you would call the LLM API.
 * @param {string[]} ingredients - An array of ingredients.
 * @returns {object} - The generated recipe object.
 */

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const createRecipe = async (ingredients) => {
  // --- Placeholder Logic ---
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error("Ingredients must be a non-empty array.");
  }
  const response = await generateRecipe(ingredients);
  if (!response || !response.content) {
    throw new Error("Invalid response from the recipe generation service.");
  }
  const parsedResponse = JSON.parse(response.content[0].text);
  const receipeTitles = parsedResponse.imageKeywords;
  const imageUrl = await generateImage(receipeTitles);
  return { ...parsedResponse, imageUrl: imageUrl };
};

const generateImage = async (receipeTitles) => {
  console.log("Generating image for recipe titles:", receipeTitles);
  let imageFound = false;
  // --- Step A: Try Unsplash First (No Change Here) ---
  for (let title of receipeTitles) {
    try {
      const unsplashResult = await unsplash.search.getPhotos({
        query: title,
        perPage: 1,
        orientation: "landscape",
      });
      if (
        unsplashResult.response &&
        unsplashResult.response.results.length > 0
      ) {
        const imageUrl = unsplashResult.response.results[0].urls.regular;
        console.log("Success! Found image on Unsplash:", imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error(
        "Unsplash API error:",
        error.message,
        " ReceipeKeywords :",
        receipeTitles
      );
    }
  }
};
