import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Receipe } from './pages/RecipePage'

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [status, setStatus] = useState('idle');
  const clearIngredients = () => {
    setIngredients([]);
  }

  const addIngredient = (ingredient) => {
    setIngredients((prev)=>[...prev, ingredient]);
  }

  return (
    <div className='container'>
    {status == 'idle' &&
      <div>
        <h1>Recipe Generator</h1>
      </div>
      }
    {status == 'render' && <Receipe />}
    </div>
  )
}

export default App
