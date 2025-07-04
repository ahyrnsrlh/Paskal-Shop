// lib/analytics.ts
// Setup Google Analytics atau Vercel Analytics

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

export function trackPurchase(orderId: string, value: number) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: value,
    currency: 'IDR'
  })
}
