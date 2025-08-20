import * as anthropicService from "./anthropicService.js";
import { recipeSchema } from "../schemas/recipeSchema.js";
import { filterIngredients } from "../utils/safety.js";
import { CustomError } from "../utils/customError.js";

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
        throw new CustomError(
          "No content received from recipe generation service.",
          502 // Bad Gateway, upstream failure
        );
      }
      console.log(
        `recipeService:CreateRecipe::Generated response: ${JSON.stringify(
          response.content[0].text
        )}`
      );

      const isUnsafe = await anthropicService.moderateText(
        JSON.stringify(response.content[0].text)
      );
      if (isUnsafe) {
        throw new CustomError(
          "Generated recipe was flagged as unsafe. Try different ingredients.",
          422 // Unprocessable Entity
        );
      }
      const parsedResponse = recipeSchema.parse(
        JSON.parse(response.content[0].text)
      );
      const imageUrl = await generateImage(parsedResponse.imageKeywords);
      return { ...parsedResponse, imageUrl: imageUrl };
    } catch (error) {
      if (attempt === retries) {
        throw new CustomError(
          `Failed to generate a valid recipe after ${retries} attempts`,
          500
        );
      }
      await new Promise((res) => setTimeout(res, 500));
    }
  }
};

export const sanitizeIngredients = async (ingredients) => {
  // This service will validate the ingredients using LLM  and return a structured response.
  const validationResult = await anthropicService.validateIngredients(
    ingredients
  );
  console.log(validationResult);
  if (!validationResult || !validationResult.content) {
    throw new CustomError(
      "Invalid response from the ingredient validation service.",
      502
    );
  }
  console.log(validationResult.content[0].text);
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
