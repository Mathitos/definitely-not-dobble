import React from 'react'
import cn from 'classnames'

import './dobble-game-card.scss'

const DobbleGameCard: React.FC<{
  card: number[]
  onGuess?: (guess: number) => void
  small?: boolean
}> = ({ card, onGuess, small = false }) => (
  <div className={cn('dobble-game-card__container', small && 'dobble-game-card__container--small')}>
    {card.map((number) => (
      <button
        className="dobble-game-card__button"
        style={getNumberStyle(number, small)}
        onClick={() => onGuess && onGuess(number)}
        tabIndex={onGuess ? 0 : -1}
        disabled={!onGuess}
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

const getFontSize = (small: boolean): string =>
  `${small ? 7 + Math.floor(Math.random() * 3) : 14 + Math.floor(Math.random() * 10)}px`

const getNumberStyle = (number: number, small: boolean): React.CSSProperties => ({
  color: getNumberColor(number),
  fontSize: getFontSize(small),
  transform: getNumberRotation(),
  fontWeight: getNumberHeight(number),
})

export default DobbleGameCard
