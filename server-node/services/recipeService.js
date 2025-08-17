import * as anthropicService from "../services/anthropicService.js";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const createRecipe = async (ingredients) => {
  // -- Step 1: Generate Recipe ---
  const response = await anthropicService.generateRecipe(ingredients);

  if (!response || !response.content) {
    throw new Error("Invalid response from the recipe generation service.");
  }
  // -- Step 2: Parse the Response ---
  const parsedResponse = JSON.parse(response.content[0].text);
  const receipeTitles = parsedResponse.imageKeywords;
  const imageUrl = await generateImage(receipeTitles);
  return { ...parsedResponse, imageUrl: imageUrl };
};

export const sanitizeIngredients = async (ingredients, res) => {
  // --- Step 1: Validate Input ---
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length < 5) {
    return res.status(400).json({
      message: "Please provide at least 5 ingredients.",
    });
  }
  // --- Step 2: Clean and Normalize Ingredients ---
  ingredients = [...new Set(ingredients.map((i) => i.toLowerCase().trim()))];
  ingredients = ingredients.filter((i) => i.length > 0);
  if (ingredients.length > 15) {
    ingredients = ingredients.slice(0, 15);
  }

  // --- Step 3: Calling Anthropic Service ---
  // This service will validate the ingredients and return a structured response.
  const validationResult = await anthropicService.validateIngredients(
    ingredients
  );
  if (!validationResult || !validationResult.content) {
    throw new Error("Invalid response from the ingredient validation service.");
  }
  return JSON.parse(validationResult.content[0].text);
};

export const generateImage = async (receipeTitles) => {
  let imageFound = false;
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
