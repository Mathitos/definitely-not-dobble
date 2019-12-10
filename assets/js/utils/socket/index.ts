import { Socket } from 'phoenix'

export type Channel = {
  join: () => any
  on: <T extends keyof ReceivedMessage>(
    ReceivedMessage: T,
    callback: (payload: ReceivedMessage[T]) => void,
  ) => void
  push: <T extends keyof SendMessage>(message: T, payload: SendMessage[T]) => void
  disconnect: () => void
}

export type SendMessage = {
  message: { text: string }
}

export type ReceivedMessage = {
  message: { user_name: string; text: string }
}

const socket = new Socket('/socket', { params: { user_token: 'user_token_test' } })
socket.connect()

const connectToChannel = (channelName: string, userName: string): Channel =>
  socket.channel(channelName, { name: userName })

const join = (channel: Channel): void =>
  channel
    .join()
    .receive('ok', (resp) => {
      console.log('Joined successfully on channel', resp)
    })
    .receive('error', (resp) => {
      console.log('Unable to join on channel', resp)
    })
    .receive('timeout', () => console.log('Networking issue. Still waiting...'))

const disconect = (channel: Channel): void => channel.disconnect()

const listenTo = <T extends keyof ReceivedMessage>(
  channel: Channel,
  message: T,
  callback: (payload: ReceivedMessage[T]) => void,
) => channel.on(message, callback)

const send = <T extends keyof SendMessage>(channel: Channel, message: T, payload: SendMessage[T]) =>
  channel.push(message, payload)

export default {
  connectToChannel,
  disconect,
  join,
  listenTo,
  send,
}
