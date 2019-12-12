import React, { useState, useEffect } from 'react'
import { ChatLine } from '../../models/Chat'

import './chat.scss'

const Chat: React.FC<{ messages: ChatLine[]; onNewMessage: (msg: string) => void }> = ({
  messages,
  onNewMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    document.getElementById('messages-container').scrollTop = document.getElementById(
      'messages-container',
    ).scrollHeight
  }, [messages])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setInputValue('')
        onNewMessage(inputValue)
      }}
      className="chat__container"
    >
      <div id="messages-container" className="chat__messages-container">
        {messages.map((msg) => (
          <RenderChatMessage {...msg} />
        ))}
      </div>
      <div className="chat__input-area">
        <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} />
        <button type="submit">Send</button>
      </div>
    </form>
  )
}

const RenderChatMessage: React.FC<ChatLine> = ({ user_name, text, time }) => (
  <span className="chat__message">
    <span className="chat__message-label">{`[${time}]: ${user_name}:`}</span>{' '}
    <span>{`${text}`}</span>
  </span>
)

export default Chat
