import { isValidPersonPayload, normalizePersonPayload } from '../../domain/entities/person.js'

export class InvalidPersonPayloadError extends Error {
  constructor(message = 'Datos inválidos') {
    super(message)
    this.name = 'InvalidPersonPayloadError'
  }
}

export const createPeopleService = ({ peopleRepository, peopleCache }) => ({
  async listPeople() {
    const cachedPeople = await peopleCache.get()
    if (cachedPeople) {
      return cachedPeople
    }

    const people = await peopleRepository.listPeople()
    await peopleCache.set(people)

    return people
  },

  async createPerson(payload) {
    const normalized = normalizePersonPayload(payload)

    if (!isValidPersonPayload(normalized)) {
      throw new InvalidPersonPayloadError()
    }

    const saved = await peopleRepository.createPerson(normalized)
    await peopleCache.clear()

    return saved
  },
})
