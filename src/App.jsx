import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

const initialPeople = [
  { id: 1, name: 'Ana', autismPoints: 94, alcoholPoints: 63, yellowCards: 18 },
  { id: 2, name: 'Bruno', autismPoints: 81, alcoholPoints: 88, yellowCards: 7 },
  { id: 3, name: 'Camila', autismPoints: 76, alcoholPoints: 59, yellowCards: 48 },
  { id: 4, name: 'Diego', autismPoints: 67, alcoholPoints: 79, yellowCards: 12 },
]

const computeCards = (yellowCards) => {
  const redCards = Math.floor(yellowCards / 4)
  const blackCards = Math.floor(redCards / 10)
  const totalCards = yellowCards + redCards + blackCards

  return { yellowCards, redCards, blackCards, totalCards }
}

const getTop = (people, valueSelector, amount = 3) =>
  [...people].sort((a, b) => valueSelector(b) - valueSelector(a)).slice(0, amount)

function App() {
  const [people, setPeople] = useState(initialPeople)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    autismPoints: 0,
    alcoholPoints: 0,
    yellowCards: 0,
  })

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`${API_BASE}/people`)

        if (!response.ok) {
          throw new Error('No se pudo cargar la base de datos')
        }

        const data = await response.json()

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
      const response = await fetch(`${API_BASE}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Error al guardar en Oracle')
      }

      const saved = await response.json()
      setPeople((previous) => [...previous, saved])
      setMessage('Persona guardada correctamente en la base de datos.')
    } catch {
      setPeople((previous) => [...previous, { id: Date.now(), ...payload }])
      setMessage('No hubo conexión a BD. Se guardó localmente para visualización.')
    }

    setFormData({
      name: '',
      autismPoints: 0,
      alcoholPoints: 0,
      yellowCards: 0,
    })
  }

  return (
    <main className="container py-4 py-md-5">
      <header className="text-center mb-4">
        <h1 className="title">RankingFut</h1>
        <p className="subtitle">Rankings de personas con almacenamiento SQL y visualización en tiempo real.</p>
      </header>

      <section className="card panel mb-4" aria-labelledby="form-title">
        <div className="card-body">
          <h2 id="form-title" className="h4 mb-3">
            Cargar persona
          </h2>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-2">
              <label htmlFor="autismPoints" className="form-label fw-semibold">
                Autismo
              </label>
              <input
                id="autismPoints"
                name="autismPoints"
                type="number"
                min="0"
                className="form-control"
                value={formData.autismPoints}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-2">
              <label htmlFor="alcoholPoints" className="form-label fw-semibold">
                Alcoholismo
              </label>
              <input
                id="alcoholPoints"
                name="alcoholPoints"
                type="number"
                min="0"
                className="form-control"
                value={formData.alcoholPoints}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-2">
              <label htmlFor="yellowCards" className="form-label fw-semibold">
                Amarillas
              </label>
              <input
                id="yellowCards"
                name="yellowCards"
                type="number"
                min="0"
                className="form-control"
                value={formData.yellowCards}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary px-4">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </section>

      <p className="visually-hidden" aria-live="polite">
        {loading ? 'Cargando datos de personas' : message}
      </p>
      {message ? <div className="alert alert-info mb-4">{message}</div> : null}

      <section className="row g-3" aria-label="Rankings principales">
        <div className="col-12 col-lg-6">
          <RankingCard title="Top 3 - Puntos de autismo" rows={topAutism} field="autismPoints" unit="pts" />
        </div>
        <div className="col-12 col-lg-6">
          <RankingCard title="Top 3 - Puntos de alcoholismo" rows={topAlcohol} field="alcoholPoints" unit="pts" />
        </div>
      </section>

      <section className="card panel mt-3" aria-labelledby="fouls-title">
        <div className="card-body">
          <h2 id="fouls-title" className="h4 mb-3">
            Ranking de faltas
          </h2>
          <div className="row g-3">
            <div className="col-12 col-md-6 col-xl-3">
              <RankingCard title="Top tarjetas totales" rows={topFouls.totalCards} field="totalCards" />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <RankingCard title="Top negras" rows={topFouls.blackCards} field="blackCards" />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <RankingCard title="Top rojas" rows={topFouls.redCards} field="redCards" />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <RankingCard title="Top amarillas" rows={topFouls.yellowCards} field="yellowCards" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function RankingCard({ title, rows, field, unit = '' }) {
  return (
    <article className="card ranking h-100" aria-label={title}>
      <div className="card-body">
        <h3 className="h6 text-uppercase fw-bold text-primary mb-3">{title}</h3>
        <ol className="list-group list-group-numbered">
          {rows.map((person) => (
            <li key={`${title}-${person.id}-${person.name}`} className="list-group-item d-flex justify-content-between">
              <span>{person.name}</span>
              <strong>
                {person[field]}
                {unit ? ` ${unit}` : ''}
              </strong>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}

export default App
