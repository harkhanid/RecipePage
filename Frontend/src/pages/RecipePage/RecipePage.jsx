import { useEffect, useState } from 'react';
import { fetchRecipes } from '../../services/recipeService';
import './RecipePage.css'; // Assuming you have a CSS file for styling

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

  console.log('Recipe fetched:', recipe);
  
  return (
 <div>
    <div class="image-container">
      <img src="./assets/images/image-omelette.jpeg" alt="omelette" />
    </div>
    {!loading && (<article class="flow-content">
      <div class="flow-content s-spacer">
        <h1>{recipe.title}</h1>
        <p>
          {recipe.description || "No description available for this recipe."}
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