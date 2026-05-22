import { createClient } from 'redis'

export const createRedisClient = async (redisUrl) => {
  if (!redisUrl) {
    return null
  }

  const redisClient = createClient({ url: redisUrl })

  redisClient.on('error', (error) => {
    console.error('Redis error:', error.message)
  })

  try {
    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.error('Redis connect error:', error.message)
    return null
  }
}
