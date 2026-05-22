const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export const listPeople = async () => {
  const response = await fetch(`${API_BASE}/people`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la base de datos')
  }

  return response.json()
}

export const createPerson = async (payload) => {
  const response = await fetch(`${API_BASE}/people`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Error al guardar en Oracle')
  }

  return response.json()
}
