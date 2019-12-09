import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Chat from '../components/Chat'

const HomePage: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  const params = new URLSearchParams(search)
  const name = params.get('name')
  return <Chat name={name} chatRoom="chat" />
}

export default HomePage
