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

    async updatePerson(personId, payload) {
      const index = people.findIndex((person) => person.id === personId)

      if (index === -1) {
        return null
      }

      people[index] = {
        ...people[index],
        ...payload,
      }

      return people[index]
    },

    async deletePerson(personId) {
      const index = people.findIndex((person) => person.id === personId)

      if (index === -1) {
        return false
      }

      people.splice(index, 1)
      return true
    },
  }
}
