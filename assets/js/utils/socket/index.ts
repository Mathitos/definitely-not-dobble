import { Socket } from 'phoenix'

export type Channel = {
  join: () => any
  on: <T extends keyof Message>(
    message: T,
    callback: (payload: Message[T]) => void,
  ) => void
  push: <T extends keyof Message>(message: T, payload: Message[T]) => void
  disconnect: () => void
}

export type Message = {
  message: { name: string; text: string }
}

const socket = new Socket('/socket', { params: { userToken: '123' } })
socket.connect()

export const connectToChannel = (channelName: string): Channel =>
  socket.channel(channelName, {})

export const join = (channel: Channel): void =>
  channel
    .join()
    .receive('ok', resp => {
      console.log('Joined successfully on channel', resp)
    })
    .receive('error', resp => {
      console.log('Unable to join on channel', resp)
    })
    .receive('timeout', () => console.log('Networking issue. Still waiting...'))

export const disconect = (channel: Channel): void => channel.disconnect()

export const listenTo = <T extends keyof Message>(
  channel: Channel,
  message: T,
  callback: (payload: Message[T]) => void,
) => channel.on(message, callback)

export const send = <T extends keyof Message>(
  channel: Channel,
  message: T,
  payload: Message[T],
) => channel.push(message, payload)
