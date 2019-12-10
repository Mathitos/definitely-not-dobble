import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Chat from '../components/Chat'

const HomePage: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  const params = new URLSearchParams(search)
  const name = params.get('name')
  const room = params.get('room')
  return <Chat name={name} chatRoom={room} />
}

export default HomePage
