import { apiRequest } from './apiClient'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export async function createPayment(orderId) {
  const response = await apiRequest('/api/Payment', {
    method: 'POST',
    body: JSON.stringify({
      orderId
    })
  })

  return await response.json()
}

export async function verifyPayment(
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) {
  const response = await apiRequest('/api/Payment/verify', {
    method: 'POST',
    body: JSON.stringify({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    })
  })

  return await response.text()
}

export async function getPaymentByOrderId(orderId) {
  const response = await apiRequest(
    `/api/Payment/order/${orderId}`
  )

  return await response.json()
}

export function openRazorpayCheckout(
  payment,
  user,
  onSuccess,
  onFailure,
  onCancel
) {
  if (!window.Razorpay) {
    onFailure('Razorpay Checkout could not be loaded.')
    return
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(payment.amount * 100),
    currency: 'INR',
    name: 'Ecommerce',
    description: `Payment for Order #${payment.orderId}`,
    order_id: payment.razorpayOrderId,

    prefill: {
      name: user.name,
      email: user.email
    },

    handler: async function (response) {
      try {
        await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        )

        onSuccess(response)
      } catch (error) {
        onFailure(error.message)
      }
    },

    modal: {
      ondismiss: function () {
        onCancel()
      }
    }
  }

  const razorpay = new window.Razorpay(options)

  razorpay.open()
}
export async function cancelPayment(orderId) {
  const response = await apiRequest(
    `/api/Payment/cancel/${orderId}`,
    {
      method: 'POST'
    }
  )

  return await response.text()
}