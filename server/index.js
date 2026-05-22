import { createApp } from './app.js'
import { hasOracleConfig, serverConfig } from './config/environment.js'
import { createPeopleCache } from './infrastructure/cache/peopleCache.js'
import { createRedisClient } from './infrastructure/cache/redisClient.js'
import { createLocalPeopleRepository } from './infrastructure/repositories/localPeopleRepository.js'
import { createOraclePeopleRepository } from './infrastructure/repositories/oraclePeopleRepository.js'

const peopleRepository = hasOracleConfig() ? createOraclePeopleRepository() : createLocalPeopleRepository()
const redisClient = await createRedisClient(serverConfig.redisUrl)
const peopleCache = createPeopleCache({
  redisClient,
  cacheKey: 'rankingfut:people',
})

try {
  await peopleRepository.init()

  const app = createApp({ peopleRepository, peopleCache })

  app.listen(serverConfig.port, () => {
    console.log(`API lista en http://localhost:${serverConfig.port}`)
  })
} catch (error) {
  console.error('No se pudo inicializar Oracle:', error.message)
  process.exit(1)
}
