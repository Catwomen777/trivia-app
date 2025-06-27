import { useState } from 'react'
import './App.css'
import CategoryForm from './components/Trivia'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Trivia App</h1>
        <p>
           This is a simple trivia application where you can test your knowledge on various topics.
          <br />
          Click the button below to start playing!
        </p>
      </header>
      <main className="App-main">
        <CategoryForm />
      </main>
    </div>
  )
}

export default App;
