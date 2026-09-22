import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { getCategories } from '../services/categoryService'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOption, setSortOption] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)

        const categoryData = await getCategories()
        setCategories(categoryData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === '' ||
        product.categoryId === Number(selectedCategory)

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOption === 'price-low') {
        return a.price - b.price
      }

      if (sortOption === 'price-high') {
        return b.price - a.price
      }

      if (sortOption === 'name') {
        return a.name.localeCompare(b.name)
      }

      return 0
    })

  function clearFilters() {
    setSearchTerm('')
    setSelectedCategory('')
    setSortOption('')
  }

  const hasFilters =
    searchTerm !== '' ||
    selectedCategory !== '' ||
    sortOption !== ''

  if (loading) {
    return <h2>Loading products...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="product-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low">
            Price: Low to High
          </option>
          <option value="price-high">
            Price: High to Low
          </option>
          <option value="name">
            Name: A to Z
          </option>
        </select>

        {hasFilters && (
          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="products-result-info">
        <p>
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1
            ? 'product'
            : 'products'}{' '}
          found
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h2>No products found</h2>
          <p>
            Try changing your search or category filters.
          </p>

          {hasFilters && (
            <button
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products