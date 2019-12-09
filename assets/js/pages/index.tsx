import React, { useEffect, useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as phoenixSocket from '../utils/socket'
import TimeHelper from '../utils/datetime'

type ChatMessage = {
  time: string
  name: string
  text: string
}

const HomePage: React.FC<RouteComponentProps> = () => {
  const [channel, _] = useState<phoenixSocket.Channel>(phoenixSocket.connectToChannel('room:chat'))

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const chatHistoryRef = useRef(chatHistory)

  useEffect(() => {
    chatHistoryRef.current = chatHistory
  }, [chatHistory])

  const updateChatHistory = (name: string, text: string): void => {
    setChatHistory([...chatHistoryRef.current, { name, text, time: TimeHelper.getCurrentTime() }])
  }

  useEffect(() => {
    phoenixSocket.listenTo(channel, 'message', (payload) => updateChatHistory(payload.name, payload.text))
    phoenixSocket.join(channel)
    return () => {
      phoenixSocket.disconect(channel)
    }
  }, [])

  const [inputValue, setInputValue] = useState<string>('')

  const sendMessage = () => {
    phoenixSocket.send(channel, 'message', {
      name: 'matheus',
      text: inputValue,
    })
    setInputValue('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {chatHistory.map((message) => (
        <RenderChatMessage {...message} />
      ))}
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
    </div>
  )
}

const RenderChatMessage: React.FC<ChatMessage> = ({ name, text, time }) => <span>{`[${time}]: ${name}: ${text}`}</span>

export default HomePage
