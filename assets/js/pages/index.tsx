import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Chat from '../components/Chat'

const HomePage: React.FC<RouteComponentProps> = (props) => {
  return (
    <>
      {console.log(props)}
      <Chat name="matheus" chatRoom="chat" />
    </>
  )
}

export default HomePage
