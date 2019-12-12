import React, { useEffect, useState, useRef } from 'react'
import PhoenixSocket, { Channel, ReceivedMessage } from '../../utils/socket'
import TimeHelper from '../../utils/datetime'
import { GameState } from '../../models/GameState'
import { ChatLine } from '../../models/Chat'
import Chat from '../Chat'

const GameRoom: React.FC<{ name: string; chatRoom: string }> = ({ name, chatRoom }) => {
  const [channel, _] = useState<Channel>(PhoenixSocket.connectToChannel(`room:${chatRoom}`, name))
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
    game_state,
  }: ReceivedMessage['game_state_update']): void => {
    console.log('update game state', game_state)
    setGameState(gameState)
  }

  useEffect(() => {
    PhoenixSocket.listenTo(channel, 'message', handleMessageReceived)
    PhoenixSocket.listenTo(channel, 'game_state_update', handleGameStateUpdateReceived)

    PhoenixSocket.join(channel)

    return () => {
      PhoenixSocket.disconect(channel)
    }
  }, [])

  const sendMessage = (newMsg: string) => {
    PhoenixSocket.send(channel, 'message', {
      text: newMsg,
    })
  }

  return (
    <div style={{ height: '200px', width: '100%', padding: '20px' }}>
      <Chat messages={chatHistory} onNewMessage={sendMessage} />

      {/* <button
        onClick={() => {
          PhoenixSocket.send(channel, 'get_game_state', null).then(console.log)
        }}
      >
        Check Status
      </button> */}
    </div>
  )
}

export default GameRoom
