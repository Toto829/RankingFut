import {
  isValidPersonPayload,
  isValidPersonUpdatePayload,
  normalizePersonPayload,
  normalizePersonUpdatePayload,
} from '../../domain/entities/person.js'

export class InvalidPersonPayloadError extends Error {
  constructor(message = 'Datos inválidos') {
    super(message)
    this.name = 'InvalidPersonPayloadError'
  }
}

export class PersonNotFoundError extends Error {
  constructor(message = 'Persona no encontrada') {
    super(message)
    this.name = 'PersonNotFoundError'
  }
}

export class InvalidPersonIdError extends Error {
  constructor(message = 'ID inválido') {
    super(message)
    this.name = 'InvalidPersonIdError'
  }
}

const parsePersonId = (value) => {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new InvalidPersonIdError()
  }

  return parsed
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

  async updatePerson(personId, payload) {
    const id = parsePersonId(personId)
    const normalized = normalizePersonUpdatePayload(payload)

    if (!isValidPersonUpdatePayload(normalized)) {
      throw new InvalidPersonPayloadError()
    }

    const updated = await peopleRepository.updatePerson(id, normalized)

    if (!updated) {
      throw new PersonNotFoundError()
    }

    await peopleCache.clear()

    return updated
  },

  async deletePerson(personId) {
    const id = parsePersonId(personId)
    const deleted = await peopleRepository.deletePerson(id)

    if (!deleted) {
      throw new PersonNotFoundError()
    }

    await peopleCache.clear()
  },
})
