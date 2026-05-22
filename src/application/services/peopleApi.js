const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

const ensureOk = async (response, message) => {
  if (!response.ok) {
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const listPeople = async () => {
  const response = await fetch(`${API_BASE}/people`)
  return ensureOk(response, 'No se pudo cargar la base de datos')
}

export const createPerson = async (payload) => {
  const response = await fetch(`${API_BASE}/people`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return ensureOk(response, 'Error al guardar en Oracle')
}

export const updatePerson = async (id, payload) => {
  const response = await fetch(`${API_BASE}/people/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return ensureOk(response, 'Error al actualizar persona')
}

export const deletePerson = async (id) => {
  const response = await fetch(`${API_BASE}/people/${id}`, {
    method: 'DELETE',
  })

  await ensureOk(response, 'Error al eliminar persona')
}
