export const initialPeople = [
  { id: 1, name: 'Ana', autismPoints: 94, alcoholPoints: 63, yellowCards: 18 },
  { id: 2, name: 'Bruno', autismPoints: 81, alcoholPoints: 88, yellowCards: 7 },
  { id: 3, name: 'Camila', autismPoints: 76, alcoholPoints: 59, yellowCards: 48 },
]

export const normalizePersonPayload = ({ name, autismPoints, alcoholPoints, yellowCards }) => ({
  name: String(name ?? '').trim(),
  autismPoints: Number(autismPoints),
  alcoholPoints: Number(alcoholPoints),
  yellowCards: Number(yellowCards),
})

export const isValidPersonPayload = ({ name, autismPoints, alcoholPoints, yellowCards }) =>
  Boolean(name) && [autismPoints, alcoholPoints, yellowCards].every((value) => Number.isFinite(value) && value >= 0)
