import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import { createClient } from 'redis'
import { hasOracleConfig, initSchema, insertPerson, listPeople } from './db.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3001)
const redisUrl = process.env.REDIS_URL

app.use(cors())
app.use(express.json())
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
)

const localPeople = [
  { id: 1, name: 'Ana', autismPoints: 94, alcoholPoints: 63, yellowCards: 18 },
  { id: 2, name: 'Bruno', autismPoints: 81, alcoholPoints: 88, yellowCards: 7 },
  { id: 3, name: 'Camila', autismPoints: 76, alcoholPoints: 59, yellowCards: 48 },
]

const redisClient = redisUrl ? createClient({ url: redisUrl }) : null

if (redisClient) {
  redisClient.on('error', (error) => {
    console.error('Redis error:', error.message)
  })

  redisClient.connect().catch((error) => {
    console.error('Redis connect error:', error.message)
  })
}

const cacheKey = 'rankingfut:people'

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/people', async (_request, response) => {
  try {
    if (redisClient?.isOpen) {
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        response.json(JSON.parse(cached))
        return
      }
    }

    const people = hasOracleConfig() ? await listPeople() : localPeople

    if (redisClient?.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(people), {
        EX: 20,
      })
    }

    response.json(people)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.post('/api/people', async (request, response) => {
  const { name, autismPoints, alcoholPoints, yellowCards } = request.body

  if (!name || [autismPoints, alcoholPoints, yellowCards].some((value) => Number.isNaN(Number(value)))) {
    response.status(400).json({ error: 'Datos inválidos' })
    return
  }

  const payload = {
    name: String(name).trim(),
    autismPoints: Number(autismPoints),
    alcoholPoints: Number(alcoholPoints),
    yellowCards: Number(yellowCards),
  }

  try {
    const saved = hasOracleConfig()
      ? await insertPerson(payload)
      : { id: Date.now(), ...payload }

    if (!hasOracleConfig()) {
      localPeople.push(saved)
    }

    if (redisClient?.isOpen) {
      await redisClient.del(cacheKey)
    }

    response.status(201).json(saved)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

initSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`API lista en http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('No se pudo inicializar Oracle:', error.message)
    process.exit(1)
  })
