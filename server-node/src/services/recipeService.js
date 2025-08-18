import * as anthropicService from "./anthropicService.js";
import { recipeSchema } from "../schemas/recipeSchema.js";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const createRecipe = async (ingredients, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // -- Step 1: Generate Recipe ---
      const response = await anthropicService.generateRecipe(ingredients);

      if (!response || !response.content) {
        throw new Error(
          "No content received from the recipe generation service."
        );
      }
      const isUnsafe = await anthropicService.moderateText(
        JSON.stringify(reresponse.content[0].textcipe)
      );
      if (isUnsafe) {
        throw new Error(
          "Generated recipe was flagged as unsafe. Try different ingredients."
        );
      }
      console;
      // -- Step 2: Parse the Response ---
      const parsedResponse = recipeSchema.parse(
        JSON.parse(response.content[0].text)
      );
      const imageUrl = await generateImage(parsedResponse.imageKeywords);
      return { ...parsedResponse, imageUrl: imageUrl };
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `Failed to generate a valid recipe after ${retries} attempts`
        );
      }
      //Delay before retrying
      await new Promise((res) => setTimeout(res, 500));
    }
  }
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
  const { safeIngredients, bannedIngredients } =
    filterIngredients(userIngredients);
  if (bannedIngredients.length > 0) {
    throw new Error(`Unsafe ingredients detected: ${banned.join(", ")}`);
  }
  // --- Step 3: Calling Anthropic Service ---
  // This service will validate the ingredients and return a structured response.
  const validationResult = await anthropicService.validateIngredients(
    safeIngredients
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
      console.warn(
        `recipeService:GenerateImage::Unsplash search failed for "${title}": ${error.message}`
      );
    }
  }
};
