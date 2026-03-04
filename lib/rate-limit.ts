import { NextRequest } from 'next/server';

const rateLimitMap = new Map();

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier) as RateLimitEntry | undefined;

  // Reset if window has passed
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitMap.set(identifier, newEntry);
    return { success: true, remaining: limit - 1, resetTime: newEntry.resetTime };
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(identifier, entry);
  
  return { 
    success: true, 
    remaining: limit - entry.count, 
    resetTime: entry.resetTime 
  };
}

export function getClientIP(request: NextRequest): string {
  // Try various headers to get the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to request IP (may not be available in all environments)
  return 'unknown';
}
