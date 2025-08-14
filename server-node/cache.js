// cache.js
const cache = {};

export function setCache(key, data, ttlSeconds = 600) {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache[key] = { data, expiry };
}

export function getCache(key) {
  const cached = cache[key];
  if (!cached) return null;

  // Expired?
  if (Date.now() > cached.expiry) {
    delete cache[key];
    return null;
  }

  return cached.data;
}
