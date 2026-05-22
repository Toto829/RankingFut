import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import { createPeopleService } from './application/services/peopleService.js'
import { createPeopleController } from './presentation/controllers/peopleController.js'
import { createPeopleRoutes } from './presentation/routes/peopleRoutes.js'

export const createApp = ({ peopleRepository, peopleCache }) => {
  const app = express()

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

  const peopleService = createPeopleService({ peopleRepository, peopleCache })
  const peopleController = createPeopleController({ peopleService })

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.use('/api', createPeopleRoutes({ peopleController }))

  return app
}
