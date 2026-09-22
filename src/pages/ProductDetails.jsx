import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../services/productService'
import { addToCart } from '../services/cartService'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

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
      setError(error.message)
    }
  }

  if (loading) {
    return <h2>Loading product...</h2>
  }

  if (error && !product) {
    return <h2>{error}</h2>
  }

  return (
    <div className="product-details-page">
      <button
        className="back-products-button"
        onClick={() => navigate('/products')}
      >
        ← Back to Products
      </button>

      {error && (
        <p className="product-details-error">
          {error}
        </p>
      )}

      <div className="product-details">
        <div className="product-details-image">
          <img
            src={product.imageUrl}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>

          <p className="product-details-description">
            {product.description}
          </p>

          <p className="product-details-price">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <button
            className="product-details-cart-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails