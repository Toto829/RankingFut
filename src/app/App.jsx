import RankingCard from '../presentation/components/RankingCard'
import { usePeopleRanking } from '../presentation/hooks/usePeopleRanking'
import '../presentation/styles/App.css'

const rankingLabels = {
  autism: 'Autismo',
  alcohol: 'Alcoholismo',
  fouls: 'Faltas',
}

const cardLabels = {
  yellow: 'Amarillas',
  red: 'Rojas',
  black: 'Negras',
}

function App() {
  const {
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
  } = usePeopleRanking()

  const rankingSections = [
    { id: 'users', label: 'Ingreso de usuarios' },
    { id: 'autism', label: 'Ranking autismo' },
    { id: 'alcohol', label: 'Ranking alcoholismo' },
    { id: 'fouls', label: 'Ranking faltas' },
  ]

  const currentUpdateOptions = rankingOptions[updateForm.ranking] ?? []
  const currentRemoveOptions = rankingOptions[removeForm.ranking] ?? []

  return (
    <main className="container py-4 py-md-5">
      <header className="text-center mb-4">
        <h1 className="title">RankingFut</h1>
        <p className="subtitle">Alta, edición por suma y rankings por criterio.</p>
      </header>

      <nav className="card panel mb-4" aria-label="Navegación de rankings">
        <div className="card-body py-2">
          <ul className="nav nav-pills flex-wrap gap-2">
            {rankingSections.map((section) => (
              <li key={section.id} className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <p className="visually-hidden" aria-live="polite">
        {loading ? 'Cargando datos de personas' : message}
      </p>
      {message ? <div className="alert alert-info mb-4">{message}</div> : null}

      {activeSection === 'users' ? (
        <section className="row g-3" aria-label="Gestión de usuarios">
          <div className="col-12 col-xl-4">
            <article className="card panel h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Agregar persona a lista</h2>
                <form className="row g-3" onSubmit={handleAddSubmit}>
                  <div className="col-12">
                    <label htmlFor="addRanking" className="form-label fw-semibold">
                      Ranking
                    </label>
                    <select
                      id="addRanking"
                      name="ranking"
                      className="form-select"
                      value={addForm.ranking}
                      onChange={handleAddChange}
                    >
                      <option value="autism">Autismo</option>
                      <option value="alcohol">Alcoholismo</option>
                      <option value="fouls">Faltas</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="addName" className="form-label fw-semibold">
                      Nombre
                    </label>
                    <input
                      id="addName"
                      name="name"
                      className="form-control"
                      value={addForm.name}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  {addForm.ranking === 'fouls' ? (
                    <div className="col-12">
                      <label htmlFor="addCardType" className="form-label fw-semibold">
                        Tipo de tarjeta
                      </label>
                      <select
                        id="addCardType"
                        name="cardType"
                        className="form-select"
                        value={addForm.cardType}
                        onChange={handleAddChange}
                      >
                        <option value="yellow">Amarilla</option>
                        <option value="red">Roja</option>
                        <option value="black">Negra</option>
                      </select>
                    </div>
                  ) : null}
                  <div className="col-12">
                    <label htmlFor="addValue" className="form-label fw-semibold">
                      {addForm.ranking === 'fouls' ? 'Cantidad de tarjetas' : 'Puntaje inicial'}
                    </label>
                    <input
                      id="addValue"
                      name="value"
                      type="number"
                      min="1"
                      className="form-control"
                      value={addForm.value}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Agregar
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </div>

          <div className="col-12 col-xl-4">
            <article className="card panel h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Sumar puntaje o tarjetas</h2>
                <form className="row g-3" onSubmit={handleUpdateSubmit}>
                  <div className="col-12">
                    <label htmlFor="updateRanking" className="form-label fw-semibold">
                      Ranking
                    </label>
                    <select
                      id="updateRanking"
                      name="ranking"
                      className="form-select"
                      value={updateForm.ranking}
                      onChange={handleUpdateChange}
                    >
                      <option value="autism">Autismo</option>
                      <option value="alcohol">Alcoholismo</option>
                      <option value="fouls">Faltas</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="updatePersonId" className="form-label fw-semibold">
                      Persona
                    </label>
                    <select
                      id="updatePersonId"
                      name="personId"
                      className="form-select"
                      value={updateForm.personId}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {currentUpdateOptions.map((person) => (
                        <option key={`update-${person.id}`} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {updateForm.ranking === 'fouls' ? (
                    <div className="col-12">
                      <label htmlFor="updateCardType" className="form-label fw-semibold">
                        Tipo de tarjeta
                      </label>
                      <select
                        id="updateCardType"
                        name="cardType"
                        className="form-select"
                        value={updateForm.cardType}
                        onChange={handleUpdateChange}
                      >
                        <option value="yellow">Amarilla</option>
                        <option value="red">Roja</option>
                        <option value="black">Negra</option>
                      </select>
                    </div>
                  ) : null}
                  <div className="col-12">
                    <label htmlFor="updateValue" className="form-label fw-semibold">
                      {updateForm.ranking === 'fouls' ? 'Cantidad a sumar' : 'Puntos a sumar'}
                    </label>
                    <input
                      id="updateValue"
                      name="value"
                      type="number"
                      min="1"
                      className="form-control"
                      value={updateForm.value}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Sumar
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </div>

          <div className="col-12 col-xl-4">
            <article className="card panel h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Quitar persona de lista</h2>
                <form className="row g-3" onSubmit={handleRemoveSubmit}>
                  <div className="col-12">
                    <label htmlFor="removeRanking" className="form-label fw-semibold">
                      Ranking
                    </label>
                    <select
                      id="removeRanking"
                      name="ranking"
                      className="form-select"
                      value={removeForm.ranking}
                      onChange={handleRemoveChange}
                    >
                      <option value="autism">Autismo</option>
                      <option value="alcohol">Alcoholismo</option>
                      <option value="fouls">Faltas</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="removePersonId" className="form-label fw-semibold">
                      Persona
                    </label>
                    <select
                      id="removePersonId"
                      name="personId"
                      className="form-select"
                      value={removeForm.personId}
                      onChange={handleRemoveChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {currentRemoveOptions
                        .filter((person) => {
                          if (removeForm.ranking === 'autism') {
                            return person.autismPoints > 0
                          }

                          if (removeForm.ranking === 'alcohol') {
                            return person.alcoholPoints > 0
                          }

                          return person.totalCards > 0
                        })
                        .map((person) => (
                          <option key={`remove-${person.id}`} value={person.id}>
                            {person.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-outline-danger w-100">
                      Quitar de lista
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {activeSection === 'autism' ? (
        <RankingCard
          title="Ranking completo - Autismo"
          rows={autismRanking}
          topIds={topIds.autism}
          emptyText="No hay personas con puntaje de autismo mayor a 0."
          columns={[
            { key: 'name', label: 'Persona' },
            { key: 'autismPoints', label: 'Puntos' },
          ]}
        />
      ) : null}

      {activeSection === 'alcohol' ? (
        <RankingCard
          title="Ranking completo - Alcoholismo"
          rows={alcoholRanking}
          topIds={topIds.alcohol}
          emptyText="No hay personas con puntaje de alcoholismo mayor a 0."
          columns={[
            { key: 'name', label: 'Persona' },
            { key: 'alcoholPoints', label: 'Puntos' },
          ]}
        />
      ) : null}

      {activeSection === 'fouls' ? (
        <RankingCard
          title="Ranking completo - Faltas"
          rows={foulsRanking}
          topIds={topIds.fouls}
          emptyText="No hay personas con faltas registradas."
          columns={[
            { key: 'name', label: 'Persona' },
            { key: 'yellowCards', label: `Tarjetas ${cardLabels.yellow}` },
            { key: 'redCards', label: `Tarjetas ${cardLabels.red}` },
            { key: 'blackCards', label: `Tarjetas ${cardLabels.black}` },
            { key: 'totalCards', label: 'Total tarjetas' },
          ]}
        />
      ) : null}

      <footer className="text-center mt-4 text-muted small">Listas independientes por ranking: {Object.values(rankingLabels).join(' · ')}</footer>
    </main>
  )
}

export default App
