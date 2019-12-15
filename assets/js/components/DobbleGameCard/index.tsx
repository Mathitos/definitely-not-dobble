import React from 'react'

import './dobble-game-card.scss'

const DobbleGameCard: React.FC<{ card: number[]; onGuess?: (guess: number) => void }> = ({
  card,
  onGuess,
}) => (
  <div className="dobble-game-card__container">
    {card.map((number) => (
      <button className="dobble-game-card__button" onClick={() => onGuess && onGuess(number)}>
        {number}
      </button>
    ))}
  </div>
)

export default DobbleGameCard
