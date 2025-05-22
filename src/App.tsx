import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/home/Home';
import LoginMenu from './pages/login-menu/LoginMenu';
import GuestScreen from './pages/guest-screen/GuestScreen';
import LoginScreen from './pages/login-screen/LoginScreen';
import MainMenu from './pages/main-menu/MainMenu';
import LocalSummary from './pages/summary/Summary';
import Nigiri1 from './pages/Nigiris/Nigiri1';
import Nigiri2 from './pages/Nigiris/Nigiri2';
import Nigiri3 from './pages/Nigiris/Nigiri3';
import Nigiri4 from './pages/Nigiris/Nigiri4';
import Nigiri5 from './pages/Nigiris/Nigiri5';
import { OrderProvider } from './context/OrderContext';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/favorites/FavoritesPage';
import User from './pages/Users/Usuarios';
import Report from './pages/reports/Reports';
import ProductResenas from './pages/resenas/Product-Resenas';
import Products from './pages/products/Products';
import Usuario from './pages/Users/Usuario';


function App() {
  return (
    <>
      <FavoritesProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/Home' element={<Home />} />
              <Route path='/Login-Menu' element={<LoginMenu />} />
              <Route path='/Guest-Screen' element={<GuestScreen />} />
              <Route path='/Login-Screen' element={<LoginScreen />} />
              <Route path='/Main-Menu' element={<MainMenu />} />
              <Route path='/Nigiri1' element={<Nigiri1 />} />
              <Route path='/Nigiri2' element={<Nigiri2 />} />
              <Route path='/Nigiri3' element={<Nigiri3 />} />
              <Route path='/Nigiri4' element={<Nigiri4 />} />
              <Route path='/Nigiri5' element={<Nigiri5 />} />
              <Route path='/Local-Summary' element={<LocalSummary />} />
              <Route path='/Favorites' element={<FavoritesPage />} />
              <Route path='/Usuarios' element={<User />} />
              {/* <Route path='/User-Profile' element={<Usuario nombre={''} correo={''} direccion={''} tipo={''} />} /> */}
              <Route path='/User-Profile' element={<Usuario/>} />
              <Route path='/Reports' element={<Report />} />
              <Route path='/Product-Resenas' element={<ProductResenas />} />
              <Route path='/Products' element={<Products />} />
              <Route path='/*' element={<Home />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </FavoritesProvider>
    </>
  )
}

export default App
