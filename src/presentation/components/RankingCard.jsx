function RankingCard({ title, rows, emptyText, columns, topIds = [] }) {
  const topById = new Map(topIds.map((id, index) => [id, index + 1]))

  return (
    <article className="card ranking h-100" aria-label={title}>
      <div className="card-body">
        <h3 className="h6 text-uppercase fw-bold text-primary mb-3">{title}</h3>
        {rows.length === 0 ? (
          <p className="mb-0 text-muted">{emptyText}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={`${title}-${column.key}`} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((person) => (
                  <tr
                    key={`${title}-${person.id}-${person.name}`}
                    className={topById.has(person.id) ? `top-${topById.get(person.id)}` : ''}
                  >
                    {columns.map((column) => (
                      <td key={`${title}-${person.id}-${column.key}`}>{person[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  )
}

export default RankingCard
