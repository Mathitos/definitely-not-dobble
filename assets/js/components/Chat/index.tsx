import React, { useEffect, useState, useRef } from 'react'
import PhoenixSocket, { Channel, ReceivedMessage } from '../../utils/socket'
import TimeHelper from '../../utils/datetime'

type ChatLine = ReceivedMessage['message'] & {
  time: string
}

const Chat: React.FC<{ name: string; chatRoom: string }> = ({ name, chatRoom }) => {
  const [channel, _] = useState<Channel>(PhoenixSocket.connectToChannel(`room:${chatRoom}`, name))

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

  useEffect(() => {
    PhoenixSocket.listenTo(channel, 'message', (payload) =>
      updateChatHistory(payload.user_name, payload.text),
    )
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
      {chatHistory.map((message) => (
        <RenderChatMessage {...message} />
      ))}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  )
}

const RenderChatMessage: React.FC<ChatLine> = ({ user_name, text, time }) => (
  <span>{`[${time}]: ${user_name}: ${text}`}</span>
)

export default Chat
