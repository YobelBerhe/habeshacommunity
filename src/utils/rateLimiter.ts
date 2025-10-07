interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    timestamps = timestamps.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (timestamps.length >= config.maxRequests) {
      return false;
    }
    
    // Add new request
    timestamps.push(now);
    this.requests.set(key, timestamps);
    
    return true;
  }

  reset(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Usage examples
export const rateLimits = {
  // 5 messages per minute
  messaging: { maxRequests: 5, windowMs: 60 * 1000 },
  
  // 10 listings per hour
  listingCreation: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
  
  // 20 searches per minute
  search: { maxRequests: 20, windowMs: 60 * 1000 },
  
  // 3 login attempts per 5 minutes
  login: { maxRequests: 3, windowMs: 5 * 60 * 1000 },
};
