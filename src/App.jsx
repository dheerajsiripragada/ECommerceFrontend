import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Checkout from './pages/Checkout'
import Register from './pages/Register'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path="/register" element={<Register />} />
          <Route path='/products' element={<Products />}/>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path='cart' element={<Cart/>}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path='orders' element={<Orders/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
