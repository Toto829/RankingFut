import { InvalidPersonPayloadError } from '../../application/services/peopleService.js'

export const createPeopleController = ({ peopleService }) => ({
  async listPeople(_request, response) {
    try {
      const people = await peopleService.listPeople()
      response.json(people)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  },

  async createPerson(request, response) {
    try {
      const saved = await peopleService.createPerson(request.body)
      response.status(201).json(saved)
    } catch (error) {
      if (error instanceof InvalidPersonPayloadError) {
        response.status(400).json({ error: error.message })
        return
      }

      response.status(500).json({ error: error.message })
    }
  },
})
