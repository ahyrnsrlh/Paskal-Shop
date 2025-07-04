// lib/rate-limit.ts
const rateLimit = new Map()

export function rateLimiter(identifier: string, limit = 5, window = 60000) {
  const now = Date.now()
  const userRequests = rateLimit.get(identifier) || []
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter((time: number) => now - time < window)
  
  if (validRequests.length >= limit) {
    return false // Rate limit exceeded
  }
  
  validRequests.push(now)
  rateLimit.set(identifier, validRequests)
  return true // Allow request
}
