import { useEffect, useState } from 'react'
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../services/cartService'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleQuantityChange(productId, newQuantity) {
    if (newQuantity < 1) {
      return
    }

    try {
      setError('')

      await updateCartItem(productId, newQuantity)

      const updatedCart = await getCart()
      setCart(updatedCart)
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleRemove(productId) {
    try {
      setError('')

      await removeCartItem(productId)

      const updatedCart = await getCart()
      setCart(updatedCart)
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleClearCart() {
    try {
      setError('')

      await clearCart()

      setCart({
        ...cart,
        items: []
      })
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart()
        setCart(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  if (loading) {
    return <h2>Loading cart...</h2>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>

        {error && (
          <p className="cart-error">
            {error}
          </p>
        )}

        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart to get started.
          </p>

          <button
            className="continue-shopping-button"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  )

  const totalItems = cart.items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  )

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {error && (
        <p className="cart-error">
          {error}
        </p>
      )}

      <div className="cart-layout">

        <div className="cart-items">

          {cart.items.map((item) => (
            <div
              className="cart-item"
              key={item.productId}
            >
              <div className="cart-item-info">

                <h2>{item.productName}</h2>

                <p className="cart-item-price">
                  ₹{item.price.toLocaleString('en-IN')} each
                </p>

                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-button"
                  onClick={() =>
                    handleRemove(item.productId)
                  }
                >
                  Remove
                </button>

              </div>

              <div className="cart-item-subtotal">
                <span>Subtotal</span>

                <strong>
                  ₹{(
                    item.price * item.quantity
                  ).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          ))}

          <button
            className="clear-cart-button"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="total-row">
            <strong>Total</strong>

            <strong>
              ₹{total.toLocaleString('en-IN')}
            </strong>
          </div>

          <button
            className="checkout-button"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

        </div>

      </div>
    </div>
  )
}

export default Cart