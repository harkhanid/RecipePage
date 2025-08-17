const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Middleware to verify the Google reCAPTCHA token using native fetch.
 */
export const verifyRecaptcha = async (req, res, next) => {
  console.log(req.body);
  try {
    const token = req.body["g-recaptcha-response"];
    console.log(`reCAPTCHA token received: ${token}`);
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
      console.log(`reCAPTCHA score: ${data.score} - VERIFIED`);
      next(); // Verification passed
    } else {
      console.log(`reCAPTCHA score: ${data.score} - BLOCKED`);
      res.status(403).json({
        message: "Failed reCAPTCHA verification. You might be a bot.",
        errors: data["error-codes"],
      });
    }
  } catch (error) {
    console.error("Error during reCAPTCHA verification:", error);
    res
      .status(500)
      .json({ message: "Server error during reCAPTCHA verification." });
  }
};
