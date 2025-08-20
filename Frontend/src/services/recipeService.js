const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchRecipes = async (ingredients, token) => {
  const response = await fetch(`${API_BASE_URL}/api/recipes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredients: ingredients,
      "g-recaptcha-response": token,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe");
  }
  return data;
};
