import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ListProducts } from './pages/Products.tsx';
import { NavBar } from './components/Navbar_components.tsx';


const router = createBrowserRouter([
  {path: "/", element: <ListProducts/>},
  {path: "/tabletek-lista", element: <ListProducts/>},
  {path: "/tabletek-felvetel", element: <ListProducts />},
  {path: "/tabletek-torles", element: <ListProducts />},
  {path: "/tabletek-kereses", element: <ListProducts />},
  {path: "/tabletek-pagination", element: <ListProducts />}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)