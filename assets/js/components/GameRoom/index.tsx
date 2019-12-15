import React, { useEffect, useState, useRef } from 'react'
import PhoenixSocket, { Channel, ReceivedMessage } from '../../utils/socket'
import TimeHelper from '../../utils/datetime'
import GameStateHelper, { GameState } from '../../models/GameState'
import { ChatLine } from '../../models/Chat'
import Chat from '../Chat'

const GameRoom: React.FC<{ name: string; chatRoom: string }> = ({ name, chatRoom }) => {
  const [channel, _] = useState<Channel>(PhoenixSocket.connectToChannel(`room:${chatRoom}`, name))
  const [userId, setUserId] = useState<number | null>(null)
  const [gameState, setGameState] = useState<GameState>([])

  const [chatHistory, setChatHistory] = useState<ChatLine[]>([])
  const chatHistoryRef = useRef(chatHistory)

  useEffect(() => {
    chatHistoryRef.current = chatHistory
  }, [chatHistory])

  const updateChatHistory = (user_name: string, text: string): void => {
    setChatHistory([
      ...chatHistoryRef.current,
      { user_name, text, time: TimeHelper.getCurrentTime() },
    ])
  }

  const handleMessageReceived = ({ user_name, text }: ReceivedMessage['message']): void => {
    updateChatHistory(user_name, text)
  }

  const handleGameStateUpdateReceived = ({
    game_state: newGameState,
  }: ReceivedMessage['game_state_update']): void => {
    console.log(newGameState)
    setGameState(newGameState)
  }

  useEffect(() => {
    PhoenixSocket.listenTo(channel, 'message', handleMessageReceived)
    PhoenixSocket.listenTo(channel, 'game_state_update', handleGameStateUpdateReceived)
    channel.onError(() => {
      console.log('there was an error with the connection!')
    })

    PhoenixSocket.join(channel).then(({ id }) => setUserId(id))

    return () => {
      PhoenixSocket.disconect(channel)
    }
  }, [])

  const sendMessage = (newMsg: string): void => {
    PhoenixSocket.send(channel, 'message', {
      text: newMsg,
    })
  }

  const handleGuess = (guess: number): void => {
    PhoenixSocket.send(channel, 'guess', { number: guess }).then(({ response }) => {
      if (response === 'right') {
        console.log('topêêê')
      } else {
        console.log('vc é meio burro né?')
      }
    })
  }

  const userCard = GameStateHelper.getUserCard({ id: userId, name }, gameState)
  const serverCard = GameStateHelper.getServerCard(gameState)
  return (
    <div>
      {userCard && serverCard && (
        <>
          <GameCard card={serverCard} onGuess={handleGuess} />
          <GameCard card={userCard} />
        </>
      )}
      <div style={{ height: '200px', width: '100%', padding: '20px' }}>
        <Chat messages={chatHistory} onNewMessage={sendMessage} />
      </div>
    </div>
  )
}

const GameCard: React.FC<{ card: number[]; onGuess?: (guess: number) => void }> = ({
  card,
  onGuess,
}) => (
  <div>
    {card.map((number) => (
      <button onClick={() => onGuess && onGuess(number)}>{number}</button>
    ))}
  </div>
)

export default GameRoom
