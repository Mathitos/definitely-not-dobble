import React, { useEffect, useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import PhoenixSocket, { Channel, ReceivedMessage } from '../../utils/socket'
import TimeHelper from '../../utils/datetime'
import GameStateHelper, { GameState, Player } from '../../models/GameState'
import { ChatLine } from '../../models/Chat'
import Chat from '../../components/Chat'
import DobbleGameCard from '../../components/DobbleGameCard'

import './game-room.scss'

const GameRoom: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  const params = new URLSearchParams(search)
  const name = params.get('name')
  const chatRoom = params.get('room')

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
  const otherPlayers = GameStateHelper.getOtherPlayersCard({ id: userId, name }, gameState)
  return (
    <div className="game-room">
      <OtherPlayersInfo players={otherPlayers} />
      {userCard && serverCard && (
        <>
          <DobbleGameCard card={serverCard} onGuess={handleGuess} />
          <DobbleGameCard card={userCard} />
        </>
      )}
      <div className="game-room__chat">
        <Chat messages={chatHistory} onNewMessage={sendMessage} />
      </div>
    </div>
  )
}

const OtherPlayersInfo: React.FC<{ players: Player[] }> = ({ players }) => (
  <div className="game-room__other-players-info">
    {players.map((player) => (
      <div className="game-room__other-player">
        <DobbleGameCard card={player.card} small />
        <span>{player.user.name}</span>
      </div>
    ))}
  </div>
)

export default GameRoom
