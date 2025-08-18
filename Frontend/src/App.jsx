import { useState, useEffect, useCallback } from 'react'
import { Receipe } from './pages/RecipePage/RecipePage'
import { WelcomePage } from './pages/WelcomePage/WelcomePage'
import { fetchRecipes } from './services/recipeService';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [status, setStatus] = useState('idle');
  const [recipe, setRecipe] = useState({});
  const [error, setError] = useState(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const renderRecipe = useCallback( async() => {
    if (!executeRecaptcha) {
      return;
    }
    if (ingredients.length === 0) return;
    setStatus('loading');
    try{
      const token = await executeRecaptcha('recipeGeneration');
      const res = await fetchRecipes(ingredients,token);
        setRecipe(res.result.recipe);
        setStatus('render');  
      }
      catch(err){
        setError(err.message)
        setStatus('idle');  
      }
  },[executeRecaptcha, ingredients]);
  
  const addIngredient = useCallback((ingredient) => {
    setIngredients((prev)=>[...prev, ingredient]);
  },[]);

  const clearIngredients = useCallback(() => {
    setIngredients([]);
    setRecipe({});
    setStatus('idle');
  },[]);

  

  return (
    <div className='container'>
    {status == 'idle' &&
      <WelcomePage ingredients={ingredients} addIngredient={addIngredient} renderRecipe={renderRecipe}/>
      }
    {status == 'loading' && <article className="flow-content">
      <div className='loading'>
        <h1>AI Chef is creating recipe for {ingredients.join(", ")}. Please wait...</h1></div></article>}
    {status == 'render' && <Receipe  ingredients={ingredients} recipe={recipe} clearIngredients={clearIngredients}/>}
    </div>
  )
}

export default App
