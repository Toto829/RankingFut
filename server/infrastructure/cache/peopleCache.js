export const createPeopleCache = ({ redisClient, cacheKey, ttlSeconds = 20 }) => ({
  async get() {
    if (!redisClient?.isOpen) {
      return null
    }

    const cached = await redisClient.get(cacheKey)
    return cached ? JSON.parse(cached) : null
  },

  async set(people) {
    if (!redisClient?.isOpen) {
      return
    }

    await redisClient.set(cacheKey, JSON.stringify(people), {
      EX: ttlSeconds,
    })
  },

  async clear() {
    if (!redisClient?.isOpen) {
      return
    }

    await redisClient.del(cacheKey)
  },
})
