import React, { useEffect, useState, useRef } from 'react'
import PhoenixSocket, { Channel, ReceivedMessage } from '../../utils/socket'
import TimeHelper from '../../utils/datetime'
import { GameState } from '../../models/GameState'

type ChatLine = ReceivedMessage['message'] & {
  time: string
}

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

  const [inputValue, setInputValue] = useState<string>('')

  const sendMessage = () => {
    PhoenixSocket.send(channel, 'message', {
      text: inputValue,
    })
    setInputValue('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Chat messages={chatHistory} onNewMessage={console.log} />

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

const Chat: React.FC<{ messages: ChatLine[]; onNewMessage: (msg: string) => void }> = ({
  messages,
  onNewMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setInputValue('')
        onNewMessage(inputValue)
      }}
    >
      <div>
        {messages.map((msg) => (
          <RenderChatMessage {...msg} />
        ))}
      </div>
      <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} />
      <button type="submit">Send</button>
    </form>
  )
}

const RenderChatMessage: React.FC<ChatLine> = ({ user_name, text, time }) => (
  <span>{`[${time}]: ${user_name}: ${text}`}</span>
)

export default GameRoom
