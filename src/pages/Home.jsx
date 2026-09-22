import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'

function Home() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const featuredProducts = products.slice(0, 4)

  return (
    <div className="home-page">
      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-hero-label">
            YOUR EVERYDAY MARKETPLACE
          </span>

          <h1>
            Find something
            <br />
            you'll love.
          </h1>

          <p>
            Explore electronics, books, clothing and home essentials
            carefully brought together in one place.
          </p>

          <div className="home-hero-actions">

            <button
              className="home-shop-button"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>

            <button
              className="home-explore-button"
              onClick={() => navigate('/products')}
            >
              Explore Products
            </button>

          </div>

        </div>

        <div className="home-hero-visual">

          <div className="hero-product-card hero-product-one">
            <span>Electronics</span>
            <strong>Smart choices.</strong>
          </div>

          <div className="hero-product-card hero-product-two">
            <span>Books</span>
            <strong>Ideas that last.</strong>
          </div>

          <div className="hero-product-card hero-product-three">
            <span>Home</span>
            <strong>Made for everyday.</strong>
          </div>

        </div>

      </section>


      {/* Categories */}

      <section className="home-categories">

        <div className="home-section-heading">
          <div>
            <span className="home-section-label">
              BROWSE COLLECTIONS
            </span>

            <h2>Shop by category</h2>
          </div>

          <button
            className="home-section-link"
            onClick={() => navigate('/products')}
          >
            View all products →
          </button>
        </div>


        <div className="home-category-grid">

          <div
            className="home-category-card category-electronics"
            onClick={() => navigate('/products')}
          >
            <div className="category-icon">⚡</div>

            <div>
              <h3>Electronics</h3>
              <p>
                Laptops, smartphones, headphones and more.
              </p>
            </div>

            <span className="category-arrow">→</span>
          </div>


          <div
            className="home-category-card category-books"
            onClick={() => navigate('/products')}
          >
            <div className="category-icon">▤</div>

            <div>
              <h3>Books</h3>
              <p>
                Discover books for learning and personal growth.
              </p>
            </div>

            <span className="category-arrow">→</span>
          </div>


          <div
            className="home-category-card category-clothing"
            onClick={() => navigate('/products')}
          >
            <div className="category-icon">◇</div>

            <div>
              <h3>Clothing</h3>
              <p>
                Everyday clothing and footwear for you.
              </p>
            </div>

            <span className="category-arrow">→</span>
          </div>


          <div
            className="home-category-card category-home"
            onClick={() => navigate('/products')}
          >
            <div className="category-icon">⌂</div>

            <div>
              <h3>Home & Kitchen</h3>
              <p>
                Useful products for your home and kitchen.
              </p>
            </div>

            <span className="category-arrow">→</span>
          </div>

        </div>

      </section>

      <section className="home-featured">

        <div className="home-section-heading">

          <div>
            <span className="home-section-label">
              HANDPICKED FOR YOU
            </span>

            <h2>Featured products</h2>
          </div>

          <button
            className="home-section-link"
            onClick={() => navigate('/products')}
          >
            Shop all →
          </button>

        </div>


        {loading ? (
          <div className="home-loading">
            Loading products...
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="home-empty">
            No products available right now.
          </div>
        ) : (
          <div className="home-products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      <section className="home-promo">

        <div className="home-promo-content">

          <span className="home-section-label">
            SIMPLE. CONVENIENT. SECURE.
          </span>

          <h2>
            Everything you need,
            <br />
            without the hassle.
          </h2>

          <p>
            Browse products, add them to your cart and complete
            your purchase securely through our checkout.
          </p>

          <button
            className="home-shop-button"
            onClick={() => navigate('/products')}
          >
            Explore the Store
          </button>

        </div>

      </section>

    </div>
  )
}

export default Home