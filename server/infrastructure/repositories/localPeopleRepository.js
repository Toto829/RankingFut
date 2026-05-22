import { initialPeople } from '../../domain/entities/person.js'

export const createLocalPeopleRepository = () => {
  const people = [...initialPeople]

  return {
    async init() {},

    async listPeople() {
      return people
    },

    async createPerson(payload) {
      const saved = {
        id: Date.now(),
        ...payload,
      }

      people.push(saved)
      return saved
    },
  }
}
