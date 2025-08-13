import { useEffect, useState, useCallback } from 'react';
import { fetchRecipes } from '../../services/recipeService';
import { useTypingEffect } from '../../services/typingTextService';
import { TypedLine } from '../../components/TypedLine';
import './RecipePage.css'; // Assuming you have a CSS file for styling


const TypedHeader = ({ tag, text, start, onComplete }) => {
  const TypedTag = tag || 'h2';
  const typedText = useTypingEffect(text, 50, start, onComplete);
  return start ? <TypedTag>{typedText}</TypedTag> : null;
};

export const Receipe = ({ingredients}) => {
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchRecipes(ingredients)
      .then((res)=>{
        setRecipe(res.result.recipe)})
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [ingredients]);

  
  const [step, setStep] = useState(0);
  const nextStep = useCallback(() => setStep(prev => prev + 1), []);


  const typedTitle = useTypingEffect(recipe.title || "", 40, true, ()=>{setStartDescription(true)});

  const typedDescription = useTypingEffect(
    recipe.description || "",
    20,
    startDescription,
    () => setStartPrepTime(true)
  );

  const prepTimeText = `
  Total: Approximately ${recipe.preparation_time?.total ?? "—"} minutes,
  Preparation: ${recipe.preparation_time?.prep ?? "—"} minutes,
  Cooking: ${recipe.preparation_time?.cook ?? "—"} minutes.
  `;

  const typedPrepTime = useTypingEffect(prepTimeText, 20, startPrepTime, () => {
    setStartIngredients(true);
  });

  // For ingredients, reveal one at a time sequentially *after* prep time finishes
  const [typedIngredients, setTypedIngredients] = useState([]);
  useEffect(() => {
    if (!startIngredients || !recipe.ingredients?.length) {
      setTypedIngredients([]);
      return;
    }

    let index = 0;
    setTypedIngredients([]);

    const interval = setInterval(() => {
      setTypedIngredients((prev) => [...prev, recipe.ingredients[index]]);
      index++;
      if (index >= recipe.ingredients.length) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [startIngredients, recipe.ingredients]);

  return (
 <div>
    <div class="image-container">
      <img src="./assets/images/image-omelette.jpeg" alt="omelette" />
    </div>
    {!loading && (<article class="flow-content">
      <div class="flow-content s-spacer">
        <h1>{typedTitle}</h1>
        <p>
          {typedDescription}
        </p>
      </div>
      <div class="card flow-content xs-spacer">
        <h3>Preparation time</h3>
        <ul class="flow-content xxs-spacer">
          <li><span class="bold">Total</span>:  {recipe.preparation_time?.total ?? "-"} minutes</li>
          <li><span class="bold">Preparation</span>: {recipe.preparation_time?.pre ?? "-"} minutes</li>
          <li><span class="bold">Cooking</span>: {recipe.preparation_time?.cook ?? "-"} minutes</li>
        </ul>
      </div>
      <div class="flow-content s-spacer">
        <h2>Ingredients</h2>
        <ul class="flow-content xxs-spacer">
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.name} {ingredient.optional ? '(optional)' : ''}
              </li>
          ))}
        </ul>  
      </div>
      <hr />
      <div class="flow-content s-spacer">
        <h2>Instructions</h2>
        <ol class="flow-content xxs-spacer">
          {
            recipe.instructions && recipe.instructions.map((step, index) => (
              <li key={index}>
                <b>{step.title}:</b> {step.description}
              </li>
            ))
          }
        </ol>
      </div>
      <hr />
      <div class="flow-content xs-spacer">
        <h2>Nutrition</h2>
        <p>The table below shows nutritional values per serving without the additional fillings.</p>
        <div class="flow-content xsm-spacer">
          <div class="split">
            <p>Calories</p>
            <p class="value">{recipe.Nutrition?.calories}</p>
          </div>
          <hr />
          <div class="split">
            <p>Carbs</p>
            <p class="value">{recipe.Nutrition?.carbohydrates}g</p>
          </div>
          <hr />
          <div class="split">
            <p>Protein</p>
            <p class="value">{recipe.Nutrition?.protein}g</p>
          </div>
          <hr />
          <div class="split">
            <p>Fat</p>
            <p class="value">{recipe.Nutrition?.fat}g</p>
          </div>
        </div>
      </div>

    </article>)}
  </div>
  );
}