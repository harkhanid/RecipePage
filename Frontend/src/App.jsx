import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Receipe } from './pages/RecipePage'
import { Ingredients } from './pages/Ingredients'

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
      <Ingredients ingredients={ingredients} addIngredient={addIngredient} renderRecipe={renderRecipe}/>
      }
    {status == 'render' && <Receipe  ingredients={ingredients}/>}
    </div>
  )
}

export default App
