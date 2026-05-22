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

export default RankingCard
