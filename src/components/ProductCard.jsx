import { useNavigate } from 'react-router-dom'
import { addToCart } from '../services/cartService'

function ProductCard({ product }) {
  const navigate = useNavigate()

  async function handleAddToCart() {
    const token = localStorage.getItem('token')

    if (!token) {
      alert(
        'Please login or create an account to add products to your cart.'
      )
      navigate('/login')
      return
    }

    try {
      await addToCart(product.id, 1)
      alert(`${product.name} added to cart!`)
    } catch (error) {
      alert(error.message)
    }
  }

  function handleViewDetails() {
    navigate(`/products/${product.id}`)
  }

  return (
    <article className="product-card">

      <div className="product-card-image">
        <img
          src={product.imageUrl}
          alt={product.name}
        />
      </div>

      <div className="product-card-content">

        <span className="product-card-category">
          Product
        </span>

        <h2>{product.name}</h2>

        <p className="product-card-description">
          {product.description}
        </p>

        <div className="product-card-bottom">

          <p className="product-price">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <div className="product-card-actions">

            <button
              className="view-details-button"
              onClick={handleViewDetails}
            >
              View Details
            </button>

            <button
              className="add-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </article>
  )
}

export default ProductCard