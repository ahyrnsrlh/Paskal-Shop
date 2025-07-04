// lib/email.ts
// Setup email untuk notifikasi order dan payment

export async function sendOrderConfirmation(email: string, orderId: string) {
  // TODO: Implement email service (Resend, SendGrid, etc.)
  console.log(`Order confirmation sent to ${email} for order ${orderId}`)
}

export async function sendPaymentNotification(email: string, orderId: string) {
  // TODO: Implement payment confirmation email
  console.log(`Payment notification sent to ${email} for order ${orderId}`)
}
