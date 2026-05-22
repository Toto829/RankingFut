import { Router } from 'express'

export const createPeopleRoutes = ({ peopleController }) => {
  const router = Router()

  router.get('/people', peopleController.listPeople)
  router.post('/people', peopleController.createPerson)
  router.patch('/people/:id', peopleController.updatePerson)
  router.delete('/people/:id', peopleController.deletePerson)

  return router
}
