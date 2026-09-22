import { useEffect, useState } from 'react'
import { getMyOrders } from '../services/orderService'
import {
  createPayment,
  openRazorpayCheckout,
  cancelPayment
} from '../services/paymentService'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingOrderId, setProcessingOrderId] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))

  async function loadOrders() {
    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  async function fetchOrders() {
    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  fetchOrders()
}, [])

  async function handlePayNow(orderId) {
    try {
      setError('')
      setProcessingOrderId(orderId)

      const payment = await createPayment(orderId)

      openRazorpayCheckout(
        payment,
        user,
        async () => {
          await loadOrders()
          setProcessingOrderId(null)
        },
        (message) => {
          setError(message)
          setProcessingOrderId(null)
        },
        async () => {
          try {
            await cancelPayment(orderId)
            await loadOrders()
            setError('Payment cancelled.')
          } catch (error) {
            setError(error.message)
          } finally {
            setProcessingOrderId(null)
          }
        }
      )
    } catch (error) {
      setError(error.message)
      setProcessingOrderId(null)
    }
  }

  function getStatusClass(status) {
    return `order-status order-status-${status.toLowerCase()}`
  }

  if (loading) {
    return <h2>Loading orders...</h2>
  }

  if (error && orders.length === 0) {
    return <h2>{error}</h2>
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {error && <p className="orders-error">{error}</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>

            <div className="order-header">
              <div>
                <h2>Order #{order.id}</h2>

                <p>
                  Placed on:{' '}
                  {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>

              <span className={getStatusClass(order.status)}>
                {order.status}
              </span>
            </div>

            <div className="order-items">
              <h3>Items</h3>

              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={item.productId}
                >
                  <div>
                    <strong>{item.productName}</strong>

                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div>
                <strong>Total</strong>
                <span>₹{order.totalAmount}</span>
              </div>

              {order.status === 'Pending' && (
                <button
                  className="pay-now-button"
                  onClick={() => handlePayNow(order.id)}
                  disabled={processingOrderId === order.id}
                >
                  {processingOrderId === order.id
                    ? 'Processing...'
                    : 'Pay Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders