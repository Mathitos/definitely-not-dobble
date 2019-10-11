import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as phoenixSocket from '../utils/socket'

const HomePage: React.FC<RouteComponentProps> = () => {
  const [channel, _] = useState<phoenixSocket.Channel>(
    phoenixSocket.connectToChannel('room:chat'),
  )
  useEffect(() => {
    phoenixSocket.listenTo(channel, 'message', payload => console.log(payload))
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
    <div>
      <input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
    </div>
  )
}

export default HomePage
