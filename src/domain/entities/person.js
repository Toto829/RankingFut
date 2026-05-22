export const initialPeople = [
  { id: 1, name: 'Ana', autismPoints: 94, alcoholPoints: 63, yellowCards: 18 },
  { id: 2, name: 'Bruno', autismPoints: 81, alcoholPoints: 88, yellowCards: 7 },
  { id: 3, name: 'Camila', autismPoints: 76, alcoholPoints: 59, yellowCards: 48 },
  { id: 4, name: 'Diego', autismPoints: 67, alcoholPoints: 79, yellowCards: 12 },
]

export const computeCards = (yellowCards) => {
  const redCards = Math.floor(yellowCards / 4)
  const blackCards = Math.floor(redCards / 10)
  const totalCards = yellowCards + redCards + blackCards

  return { yellowCards, redCards, blackCards, totalCards }
}

export const getTop = (people, valueSelector, amount = 3) =>
  [...people].sort((a, b) => valueSelector(b) - valueSelector(a)).slice(0, amount)
