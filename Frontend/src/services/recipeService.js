const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchRecipes = async (ingredients) => {
  console.log(
    "Fetching recipes from API at:",
    `${API_BASE_URL}/api/recipes/generate`
  );
  const response = await fetch(`${API_BASE_URL}/api/recipes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredients: ingredients,
      // "g-recaptcha-response": token,
    }),
  });
  return await response.json();
};
