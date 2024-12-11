import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import { NavBar } from './components/Navbar_components'
import { ListProducts } from './pages/Products'

function App() {
  

  return (
    <>
      <NavBar/>
      <ListProducts />
    </>
  )
}

export default App
