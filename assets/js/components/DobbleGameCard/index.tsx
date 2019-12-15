import React from 'react'

import './dobble-game-card.scss'

const DobbleGameCard: React.FC<{ card: number[]; onGuess?: (guess: number) => void }> = ({
  card,
  onGuess,
}) => (
  <div className="dobble-game-card__container">
    {card.map((number) => (
      <button
        className="dobble-game-card__button"
        style={getNumberStyle(number)}
        onClick={() => onGuess && onGuess(number)}
      >
        {number}
      </button>
    ))}
  </div>
)

const colors: string[] = [
  'Lavender',
  'YellowGreen',
  'Teal',
  'SaddleBrown',
  'Salmon',
  'RebeccaPurple',
  'Red',
  'Magenta',
]

const getNumberColor = (number: number): string => colors[number % 8]

const getNumberRotation = (): string => `rotate(${90 - Math.floor(Math.random() * 180)}deg)`

const getNumberHeight = (number: number): 'normal' | 'bold' =>
  number % 2 === 0 ? 'normal' : 'bold'

const getFontSize = (): string => `${14 + Math.floor(Math.random() * 10)}px`

const getNumberStyle = (number: number): React.CSSProperties => ({
  color: getNumberColor(number),
  fontSize: getFontSize(),
  transform: getNumberRotation(),
  fontWeight: getNumberHeight(number),
})

export default DobbleGameCard
