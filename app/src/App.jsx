import { useState } from 'react';
import Navbar from './layouts/Navbar/navbar';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <h1 class="text-3xl font-bold underline pt-24">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
      <p>aaaaaaaa</p>
    </>
  )
}

export default App
