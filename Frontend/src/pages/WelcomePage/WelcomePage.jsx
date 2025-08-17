import HomeImage from '../../assets/home.jpg';
import './WelcomePage.css';

export const WelcomePage = ({ingredients, addIngredient, renderRecipe}) => {
  const formSubmit = (formData) => {
    addIngredient(formData.get('ingredient'));
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
          This is a simple recipe application where you can find various recipes to cook. 
          You can also add ingredients to your list and get a recipe based on those ingredients.
        </p>
      </div>
      <div >
        <form action={formSubmit} className="form-container">
          <input type="text" placeholder="Please add atleast 5 ingredients" name='ingredient' />
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