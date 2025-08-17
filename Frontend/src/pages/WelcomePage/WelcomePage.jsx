import HomeImage from '../../assets/home.jpg';
import './WelcomePage.css';

export const WelcomePage = ({ingredients, addIngredient, renderRecipe}) => {
  const formSubmit = (formData) => {
    const ingredient = formData.get('ingredient').trim();
    if (ingredient === ''|| ingredients.includes(ingredient)) {
      return;
    }
    addIngredient(ingredient);
  }

  const generateRecipe = () => {
    renderRecipe();
  }

  return (
  <div>
    <div className="image-container">
    <img src={HomeImage} className="welcome_image" alt="Chef Robot" /> </div>
    <article className="flow-content">
      <div className="flow-content s-spacer">
        <h1>Welcome to AI Chef</h1>
        <p>
          <b>AI Chef</b> is your personal recipe generator. It creates recipes based on the ingredients you have at home.
          Just add at least 5 ingredients you have, and AI Chef will suggest a recipe for you.
        </p>
      </div>
      <div >
        <form action={formSubmit} className="form-container">
          <input type="text" placeholder="Ex. Rice" name='ingredient' />
          <button className="btn">Add Ingredient</button>
      </form>
      </div>
      {ingredients.length > 0 && <div className="flow-content s-spacer">
        <h2>Ingredients</h2>
        <ul className="flow-content xxs-spacer">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>  
      </div>
      }
      {ingredients.length >= 5 && 
      <button type='button' className="submit-button" onClick={() => {generateRecipe()}}>Generate Recipe</button>}
    </article>
  </div>
  );
}