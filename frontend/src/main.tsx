import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ListProducts } from './pages/Products.tsx';
import { NavBar } from './components/Navbar_components.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Cart } from './pages/Cart.tsx';
import { Profile } from './pages/Profile.tsx';
import { AuthProvider } from './context/Context.tsx';
import { Logout } from './pages/Logout.tsx';


const router = createBrowserRouter([
  {path: "/", element: <ListProducts/>},
  {path: "/Cart", element: <Cart/>},
  {path: "/Logout", element: <Logout />},
  {path: "/Profile", element: <Profile />},
  {path: "/Login", element: <Login />},
  {path: "/Register", element: <Register/>}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <NavBar />
    <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)