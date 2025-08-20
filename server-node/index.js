// --- Imports ---
import "dotenv/config"; // Load environment variables from .env file

import express from "express";
import rateLimit from "express-rate-limit"; // Import the library
import apiRoutes from "./src/routes/index.js"; // Import the main router
import { errorHandler } from "./src/middleware/errorHandler.js";
import { requestIdMiddleware } from "./src/middleware/requestId.js";

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 5 requests per window (per hour)
  message: "You have exceeded the 5 requests in an hour limit!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to your API routes
app.use("/api", limiter);
// --- Middleware ---
// Parses incoming JSON payloads
app.use(express.json());

app.use(requestIdMiddleware);

// --- Routes ---
// The main entry point for all API routes
app.use("/api", apiRoutes);
app.use(errorHandler);

// A simple root route to confirm the server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
