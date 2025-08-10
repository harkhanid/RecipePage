const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const fetchRecipes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/recipes`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
};
