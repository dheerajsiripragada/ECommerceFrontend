import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    function handleStorageChange() {
      setToken(localStorage.getItem('token'))
      setUser(JSON.parse(localStorage.getItem('user')))
    }

    window.addEventListener('authChange', handleStorageChange)

    return () => {
      window.removeEventListener('authChange', handleStorageChange)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.dispatchEvent(new Event('authChange'))

    navigate('/login')
  }

  function handleSearch(event) {
    event.preventDefault()

    navigate(
      searchTerm.trim()
        ? `/products?search=${encodeURIComponent(searchTerm.trim())}`
        : '/products'
    )
  }

  return (
    <header className="site-header">

      <div className="navbar-main">

        <Link to="/" className="navbar-brand">
          <span className="brand-mark">E</span>
          <span>Ecommerce</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/products">Categories</Link>
          <Link to="/products">Deals</Link>
        </nav>

        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products, brands & more..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div className="navbar-actions">

          {!token && (
            <Link to="/login" className="account-link">
              <span>Welcome</span>
              <strong>Sign In</strong>
            </Link>
          )}

          {token && (
            <div className="account-user">
              <span>Welcome</span>
              <strong>{user?.name || 'Account'}</strong>
            </div>
          )}

          {token && user?.role === 'User' && (
            <Link to="/orders" className="orders-link">
              Orders
            </Link>
          )}

          {token && user?.role === 'Admin' && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}

          {token && user?.role === 'User' && (
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
            </Link>
          )}

          {!token && (
            <Link to="/register" className="register-link">
              Register
            </Link>
          )}

          {token && (
            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </header>
  )
}

export default Navbar