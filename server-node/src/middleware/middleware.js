const MIN_INGREDIENTS = 5;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_THRESHOLD = 0.5; // Adjust this threshold based on your needs
import { CustomError } from "../utils/customError.js";
import { filterIngredients } from "../utils/safety.js";
import { logger } from "../utils/logger.js";
/**
 * Middleware to verify the Google reCAPTCHA token using native fetch.
 */
export const verifyRecaptcha = async (req, res, next) => {
  try {
    const token = req.body["g-recaptcha-response"];
    if (!token) {
      return res.status(400).json({ message: "reCAPTCHA token is missing." });
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    // Check for success AND if the score is above your threshold
    if (data.success && data.score >= RECAPTCHA_THRESHOLD) {
      next(); // Verification passed
    } else {
      res.status(403).json({
        message: "Failed reCAPTCHA verification. You might be a bot.",
        errors: data["error-codes"],
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during reCAPTCHA verification." });
  }
};

export const unsafeInputMiddleware = (req, res, next) => {
  const ingredients = req.body.ingredients;
  console.log("Middleware:unsafeInputMiddleware::Ingredients:", ingredients);
  if (!ingredients || !Array.isArray(ingredients)) {
    throw new CustomError("Ingredients must be a non-empty array.", 400);
  }

  const { safe, banned } = filterIngredients(ingredients);
  if (banned.length > 0) {
    logger.error(
      { requestId: req.requestId, ingredients: ingredients },
      `Middleware:Unsafe ingredient attempt, Ingredients: ${banned}`
    );
    throw new CustomError(
      `Unsafe ingredients detected: ${banned.join(", ")}`,
      400
    );
  }

  if (safe.length < MIN_INGREDIENTS) {
    throw new CustomError(
      `Please provide at least ${MIN_INGREDIENTS} valid ingredients.`,
      400
    );
  }

  // Everything safe, proceed
  req.body.ingredients = safe; // Normalize to only safe ingredients
  next();
};
