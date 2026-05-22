import { useEffect, useMemo, useState } from 'react'
import { createPerson, listPeople, updatePerson } from '../../application/services/peopleApi'
import { computeCards, initialPeople } from '../../domain/entities/person'

const defaultAddForm = {
  name: '',
}

const defaultUpdateForm = {
  ranking: 'autism',
  personId: '',
  value: 0,
  cardType: 'yellow',
}

const defaultRemoveForm = {
  ranking: 'autism',
  personId: '',
}

const rankingFieldMap = {
  autism: 'autismPoints',
  alcohol: 'alcoholPoints',
  fouls: 'yellowCards',
}

const cardMultiplierMap = {
  yellow: 1,
  red: 4,
  black: 40,
}

const getYellowCardsAmount = (value, cardType) => Number(value) * cardMultiplierMap[cardType]

const withComputedCards = (people) =>
  people.map((person) => ({
    ...person,
    ...computeCards(Number(person.yellowCards) || 0),
  }))

const compareByFieldDesc = (field) => (a, b) => Number(b[field]) - Number(a[field])

const getRankingRows = (people, ranking, includeZero = false) => {
  const field = ranking === 'fouls' ? 'totalCards' : rankingFieldMap[ranking]

  return [...people]
    .filter((person) => (includeZero ? true : Number(person[field]) > 0))
    .sort(compareByFieldDesc(field))
}

const getTopIds = (rows) => rows.slice(0, 3).map((person) => person.id)

const replacePersonInList = (people, person) => people.map((row) => (row.id === person.id ? person : row))

const findByName = (people, name) =>
  people.find((person) => person.name.trim().toLowerCase() === name.trim().toLowerCase())

export const usePeopleRanking = () => {
  const [people, setPeople] = useState(initialPeople)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('users')
  const [addForm, setAddForm] = useState(defaultAddForm)
  const [updateForm, setUpdateForm] = useState(defaultUpdateForm)
  const [removeForm, setRemoveForm] = useState(defaultRemoveForm)

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const data = await listPeople()

        if (Array.isArray(data)) {
          setPeople(data)
        }
      } catch {
        setMessage('Usando modo local de respaldo. Podés conectar Oracle para guardar en SQL Developer.')
      } finally {
        setLoading(false)
      }
    }

    fetchPeople()
  }, [])

  const enrichedPeople = useMemo(() => withComputedCards(people), [people])

  const autismRanking = useMemo(() => getRankingRows(enrichedPeople, 'autism'), [enrichedPeople])
  const alcoholRanking = useMemo(() => getRankingRows(enrichedPeople, 'alcohol'), [enrichedPeople])
  const foulsRanking = useMemo(() => getRankingRows(enrichedPeople, 'fouls'), [enrichedPeople])

  const rankingOptions = useMemo(
    () => ({
      autism: getRankingRows(enrichedPeople, 'autism', true),
      alcohol: getRankingRows(enrichedPeople, 'alcohol', true),
      fouls: getRankingRows(enrichedPeople, 'fouls', true),
    }),
    [enrichedPeople],
  )

  const topIds = useMemo(
    () => ({
      autism: getTopIds(autismRanking),
      alcohol: getTopIds(alcoholRanking),
      fouls: getTopIds(foulsRanking),
    }),
    [autismRanking, alcoholRanking, foulsRanking],
  )

  const handleAddChange = (event) => {
    const { name, value } = event.target
    setAddForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleUpdateChange = (event) => {
    const { name, value } = event.target
    setUpdateForm((previous) => ({
      ...previous,
      [name]: name === 'ranking' || name === 'personId' || name === 'cardType' ? value : Number(value),
    }))
  }

  const handleRemoveChange = (event) => {
    const { name, value } = event.target
    setRemoveForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleAddSubmit = async (event) => {
    event.preventDefault()

    const name = addForm.name.trim()

    if (!name) {
      setMessage('Ingresá un nombre válido.')
      return
    }

    const existing = findByName(people, name)

    if (existing) {
      setMessage('La persona ya existe. Usá la sección de suma para cargar puntos o tarjetas.')
      return
    }

    const payload = {
      name,
      autismPoints: 0,
      alcoholPoints: 0,
      yellowCards: 0,
    }

    try {
      const saved = await createPerson(payload)
      setPeople((previous) => [...previous, saved])
      setMessage('Persona agregada correctamente.')
    } catch {
      setPeople((previous) => [...previous, { id: Date.now(), ...payload }])
      setMessage('Sin conexión a BD: se guardó localmente para visualización.')
    }

    setAddForm(defaultAddForm)
  }

  const handleUpdateSubmit = async (event) => {
    event.preventDefault()

    const targetList = rankingOptions[updateForm.ranking]
    const selectedPerson = targetList.find((person) => String(person.id) === String(updateForm.personId))

    if (!selectedPerson) {
      setMessage('Seleccioná una persona para editar.')
      return
    }

    if (Number(updateForm.value) <= 0) {
      setMessage('Ingresá un valor mayor a 0 para sumar.')
      return
    }

    const field = rankingFieldMap[updateForm.ranking]
    const payload = {
      [field]:
        updateForm.ranking === 'fouls'
          ? Number(selectedPerson.yellowCards) + getYellowCardsAmount(updateForm.value, updateForm.cardType)
          : Number(selectedPerson[field]) + Number(updateForm.value),
    }

    try {
      const updated = await updatePerson(selectedPerson.id, payload)
      setPeople((previous) => replacePersonInList(previous, updated))
      setMessage('Puntaje actualizado correctamente.')
    } catch {
      setPeople((previous) =>
        replacePersonInList(previous, {
          ...selectedPerson,
          ...payload,
        }),
      )
      setMessage('Sin conexión a BD: puntaje actualizado localmente.')
    }

    setUpdateForm(defaultUpdateForm)
  }

  const handleRemoveSubmit = async (event) => {
    event.preventDefault()

    const targetList = rankingOptions[removeForm.ranking]
    const selectedPerson = targetList.find((person) => String(person.id) === String(removeForm.personId))

    if (!selectedPerson) {
      setMessage('Seleccioná una persona para quitar de la lista.')
      return
    }

    const field = rankingFieldMap[removeForm.ranking]
    const payload = { [field]: 0 }

    try {
      const updated = await updatePerson(selectedPerson.id, payload)
      setPeople((previous) => replacePersonInList(previous, updated))
      setMessage('Persona quitada de la lista.')
    } catch {
      setPeople((previous) =>
        replacePersonInList(previous, {
          ...selectedPerson,
          ...payload,
        }),
      )
      setMessage('Sin conexión a BD: cambio aplicado localmente.')
    }

    setRemoveForm(defaultRemoveForm)
  }

  return {
    activeSection,
    addForm,
    alcoholRanking,
    autismRanking,
    foulsRanking,
    handleAddChange,
    handleAddSubmit,
    handleRemoveChange,
    handleRemoveSubmit,
    handleUpdateChange,
    handleUpdateSubmit,
    loading,
    message,
    rankingOptions,
    removeForm,
    setActiveSection,
    topIds,
    updateForm,
  }
}
