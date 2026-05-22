import { useEffect, useMemo, useState } from 'react'
import { createPerson, listPeople } from '../../application/services/peopleApi'
import { computeCards, getTop, initialPeople } from '../../domain/entities/person'

const emptyForm = {
  name: '',
  autismPoints: 0,
  alcoholPoints: 0,
  yellowCards: 0,
}

export const usePeopleRanking = () => {
  const [people, setPeople] = useState(initialPeople)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const data = await listPeople()

        if (Array.isArray(data) && data.length > 0) {
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

  const enrichedPeople = useMemo(
    () => people.map((person) => ({ ...person, ...computeCards(Number(person.yellowCards) || 0) })),
    [people],
  )

  const topAutism = useMemo(() => getTop(enrichedPeople, (person) => person.autismPoints), [enrichedPeople])
  const topAlcohol = useMemo(() => getTop(enrichedPeople, (person) => person.alcoholPoints), [enrichedPeople])
  const topFouls = useMemo(
    () => ({
      totalCards: getTop(enrichedPeople, (person) => person.totalCards),
      blackCards: getTop(enrichedPeople, (person) => person.blackCards),
      redCards: getTop(enrichedPeople, (person) => person.redCards),
      yellowCards: getTop(enrichedPeople, (person) => person.yellowCards),
    }),
    [enrichedPeople],
  )

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'name' ? value : Number(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      setMessage('Ingresá un nombre válido.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      autismPoints: Number(formData.autismPoints),
      alcoholPoints: Number(formData.alcoholPoints),
      yellowCards: Number(formData.yellowCards),
    }

    try {
      const saved = await createPerson(payload)
      setPeople((previous) => [...previous, saved])
      setMessage('Persona guardada correctamente en la base de datos.')
    } catch {
      setPeople((previous) => [...previous, { id: Date.now(), ...payload }])
      setMessage('No hubo conexión a BD. Se guardó localmente para visualización.')
    }

    setFormData(emptyForm)
  }

  return {
    formData,
    handleInputChange,
    handleSubmit,
    loading,
    message,
    topAlcohol,
    topAutism,
    topFouls,
  }
}
