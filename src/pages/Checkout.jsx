import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart } from '../services/cartService'
import { placeOrder } from '../services/orderService'
import {
  createPayment,
  openRazorpayCheckout
} from '../services/paymentService'

function Checkout() {
  const navigate = useNavigate()

  const [processing, setProcessing] = useState(false)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  async function handlePlaceOrder() {
    try {
      setError('')
      setProcessing(true)

      const order = await placeOrder()

      const payment = await createPayment(order.id)

      const user = JSON.parse(localStorage.getItem('user'))

      openRazorpayCheckout(
        payment,
        user,
        () => {
          navigate('/orders')
        },
        (message) => {
          setError(message)
          setProcessing(false)
        }
      )
    } catch (error) {
      setError(error.message)
      setProcessing(false)
    }
  }

  function handleAddressChange(event) {
    const { name, value } = event.target

    setAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value
    }))
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
    return <h2>Loading checkout...</h2>
  }

  if (error && !cart) {
    return <h2>{error}</h2>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <button
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
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && (
        <p className="checkout-error">
          {error}
        </p>
      )}

      <div className="checkout-layout">

        <div className="checkout-left">

          <div className="checkout-section">
            <h2>Shipping Address</h2>

            <p className="checkout-section-description">
              Enter the address where you want your order delivered.
            </p>

            <div className="address-form">

              <div className="checkout-field">
                <label htmlFor="checkout-name">
                  Full Name
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={address.name}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-phone">
                  Phone Number
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={address.phone}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-address">
                  Address
                </label>

                <textarea
                  id="checkout-address"
                  name="address"
                  placeholder="Enter your address"
                  value={address.address}
                  onChange={handleAddressChange}
                  rows="3"
                />
              </div>

              <div className="address-row">

                <div className="checkout-field">
                  <label htmlFor="checkout-city">
                    City
                  </label>

                  <input
                    id="checkout-city"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-state">
                    State
                  </label>

                  <input
                    id="checkout-state"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-pincode">
                    PIN Code
                  </label>

                  <input
                    id="checkout-pincode"
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={address.pincode}
                    onChange={handleAddressChange}
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="checkout-section">

            <h2>Items in Your Order</h2>

            <div className="checkout-items">

              {cart.items.map((item) => (
                <div
                  className="checkout-item"
                  key={item.productId}
                >
                  <div>
                    <h3>{item.productName}</h3>

                    <p>
                      ₹{item.price.toLocaleString('en-IN')}
                      {' × '}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹{(
                      item.price * item.quantity
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}

            </div>
          </div>

        </div>

        <div className="checkout-summary">

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

          <div className="checkout-total">
            <strong>Total</strong>

            <strong>
              ₹{total.toLocaleString('en-IN')}
            </strong>
          </div>

          <button
            className="back-cart-button"
            onClick={() => navigate('/cart')}
            disabled={processing}
          >
            Back to Cart
          </button>

          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={processing}
          >
            {processing
              ? 'Processing...'
              : 'Place Order & Pay'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default Checkout