const MAX_INGREDIENT_LENGTH = 50;
const MAX_INGREDIENTS = 15;

const BANNED_WORDS = JSON.parse(
  process.env.BANNED_WORDS ||
    '["poison","bomb","explosive","gun","knife","hate","kill","assault","drugs","terror","attack","radiation","virus","fire","arson","weapon","acid","threat","nuclear","bullet","gunpowder","violence","hazard","cyanide","arsenic","chemical","explosive device","toxins","illegal","smoke","firearms","molotov","knife attack","sabotage","bombing","toxic","corrosive","danger","weaponry","hostile","hazardous","attack plan","bioweapon","dangerous substance","harmful"]'
);

const sanitizeString = (str) =>
  str.replace(/[\u0000-\u001F\u007F]/g, "").trim();
/**
 * Checks if an ingredient is safe.
 * @param {string} ingredient
 * @returns {boolean} true if safe, false if banned
 */

const isIngredientSafe = (ingredient) => {
  const lower = ingredient.toLowerCase().trim();
  return !BANNED_WORDS.some((word) => lower.includes(word));
};

/**
 * Filters an array of ingredients into safe and banned lists
 * @param {string[]} ingredients
 * @returns {{ safe: string[], banned: string[] }}
 */
export const filterIngredients = (ingredients) => {
  const safe = [];
  const banned = [];

  // Normalize, sanitize, deduplicate
  const cleaned = [
    ...new Set(
      ingredients
        .map((i) => sanitizeString(i.toLowerCase()))
        .filter((i) => i.length > 0 && i.length <= MAX_INGREDIENT_LENGTH)
    ),
  ];

  // Limit number of ingredients
  const limited = cleaned.slice(0, MAX_INGREDIENTS);
  for (let ing of limited) {
    if (isIngredientSafe(ing)) {
      safe.push(ing);
    } else {
      banned.push(ing);
    }
  }
  return { safe, banned };
};
