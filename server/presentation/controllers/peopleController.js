import {
  InvalidPersonIdError,
  InvalidPersonPayloadError,
  PersonNotFoundError,
} from '../../application/services/peopleService.js'

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

  async updatePerson(request, response) {
    try {
      const updated = await peopleService.updatePerson(request.params.id, request.body)
      response.json(updated)
    } catch (error) {
      if (error instanceof InvalidPersonPayloadError || error instanceof InvalidPersonIdError) {
        response.status(400).json({ error: error.message })
        return
      }

      if (error instanceof PersonNotFoundError) {
        response.status(404).json({ error: error.message })
        return
      }

      response.status(500).json({ error: error.message })
    }
  },

  async deletePerson(request, response) {
    try {
      await peopleService.deletePerson(request.params.id)
      response.status(204).send()
    } catch (error) {
      if (error instanceof InvalidPersonIdError) {
        response.status(400).json({ error: error.message })
        return
      }

      if (error instanceof PersonNotFoundError) {
        response.status(404).json({ error: error.message })
        return
      }

      response.status(500).json({ error: error.message })
    }
  },
})
