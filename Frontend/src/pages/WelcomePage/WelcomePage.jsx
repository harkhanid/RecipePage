import HomeImage from '../../assets/home.jpg';
import './WelcomePage.css';

export const WelcomePage = ({ingredients, addIngredient, renderRecipe}) => {
  const formSubmit = (formData) => {
    addIngredient(formData.get('ingredient'));
  }

  const generateRecipe = () => {
    console.log("Generating recipe with ingredients:", ingredients);
    if (ingredients.length < 0) {
      alert('Please add at least 5 ingredients to get a recipe.');
      return;
    }
    renderRecipe();
  }
  return (
  <div>
    <div class="image-container">
    <img src={HomeImage} className="welcome_image" alt="Chef Robot" /> </div>
    <article class="flow-content">
      <div class="flow-content s-spacer">
        <h1>Welcome to AI Chef</h1>
        <p>
          This is a simple recipe application where you can find various recipes to cook. 
          You can also add ingredients to your list and get a recipe based on those ingredients.
        </p>
      </div>
      <div >
        <form action={formSubmit} className="form-container">
          <input type="text" placeholder="Enter a ingredient" name='ingredient' />
          <button class="btn">Add Ingredient</button>
      </form>
      </div>
      {ingredients.length > 0 && <div class="flow-content s-spacer">
        <h2>Ingredients</h2>
        <ul class="flow-content xxs-spacer">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>  
      </div>
      }
      <button class="submit-button" onClick={() => {generateRecipe()}}>Generate Recipe</button>
    </article>
  </div>
  );
}