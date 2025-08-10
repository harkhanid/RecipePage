// --- Imports ---
import "dotenv/config"; // Load environment variables from .env file

import express from "express";
import apiRoutes from "./routes/index.js"; // Import the main router

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Parses incoming JSON payloads
app.use(express.json());

// --- Routes ---
// The main entry point for all API routes
app.use("/api", apiRoutes);

// A simple root route to confirm the server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
