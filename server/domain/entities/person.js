export const initialPeople = [
  { id: 1, name: 'Ana', autismPoints: 94, alcoholPoints: 63, yellowCards: 18 },
  { id: 2, name: 'Bruno', autismPoints: 81, alcoholPoints: 88, yellowCards: 7 },
  { id: 3, name: 'Camila', autismPoints: 76, alcoholPoints: 59, yellowCards: 48 },
]

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const normalizePersonPayload = ({ name, autismPoints, alcoholPoints, yellowCards }) => ({
  name: String(name ?? '').trim(),
  autismPoints: toNumber(autismPoints, 0),
  alcoholPoints: toNumber(alcoholPoints, 0),
  yellowCards: toNumber(yellowCards, 0),
})

export const isValidPersonPayload = ({ name, autismPoints, alcoholPoints, yellowCards }) =>
  Boolean(name) && [autismPoints, alcoholPoints, yellowCards].every((value) => Number.isFinite(value) && value >= 0)

export const normalizePersonUpdatePayload = (payload = {}) => {
  const normalized = {}

  if (Object.hasOwn(payload, 'name')) {
    normalized.name = String(payload.name ?? '').trim()
  }

  for (const field of ['autismPoints', 'alcoholPoints', 'yellowCards']) {
    if (Object.hasOwn(payload, field)) {
      normalized[field] = Number(payload[field])
    }
  }

  return normalized
}

export const isValidPersonUpdatePayload = (payload = {}) => {
  const keys = Object.keys(payload)

  if (keys.length === 0) {
    return false
  }

  if (Object.hasOwn(payload, 'name') && !payload.name) {
    return false
  }

  for (const field of ['autismPoints', 'alcoholPoints', 'yellowCards']) {
    if (Object.hasOwn(payload, field)) {
      if (!Number.isFinite(payload[field]) || payload[field] < 0) {
        return false
      }
    }
  }

  return true
}
