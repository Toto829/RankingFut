import RankingCard from '../presentation/components/RankingCard'
import { usePeopleRanking } from '../presentation/hooks/usePeopleRanking'
import '../presentation/styles/App.css'

function App() {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    loading,
    message,
    topAlcohol,
    topAutism,
    topFouls,
  } = usePeopleRanking()

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

export default App
