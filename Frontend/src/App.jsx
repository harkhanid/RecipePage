import { useState } from 'react'
import { Receipe } from './pages/RecipePage/RecipePage'
import { WelcomePage } from './pages/WelcomePage/WelcomePage'
import './App.css'

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [status, setStatus] = useState('idle');

  const clearIngredients = () => {
    setIngredients([]);
  }
  
  const renderRecipe = () => {
    setStatus('render');
  }

  const addIngredient = (ingredient) => {
    setIngredients((prev)=>[...prev, ingredient]);
  }

  return (
    <div className='container'>
    {status == 'idle' &&
      <WelcomePage ingredients={ingredients} addIngredient={addIngredient} renderRecipe={renderRecipe}/>
      }
    {status == 'render' && <Receipe  ingredients={ingredients}/>}
    </div>
  )
}

export default App
