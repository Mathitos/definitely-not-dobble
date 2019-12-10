import { Socket } from 'phoenix'
import { GameState } from '../../models/GameState'

export type Channel = {
  join: () => any
  on: <T extends keyof ReceivedMessage>(
    ReceivedMessage: T,
    callback: (payload: ReceivedMessage[T]) => void,
  ) => void
  push: <T extends keyof SendMessage>(message: T, payload: SendMessage[T]) => Push<T>
  disconnect: () => void
}

interface Push<T extends keyof ResponseMessage> {
  resend: (timeout: number) => void
  send: () => void
  receive: {
    (status: 'ok', callback: (payload: ResponseMessage[T]) => void): void
    (status: 'error', callback: (payload: unknown) => void): void
  }
}

export type SendMessage = {
  message: { text: string }
  get_game_state: null
}

export type ResponseMessage = {
  message: void
  get_game_state: GameState
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

const send = <T extends keyof SendMessage>(
  channel: Channel,
  message: T,
  payload: SendMessage[T],
): Promise<ResponseMessage[T]> =>
  new Promise(
    (resolve: (payload: ResponseMessage[T]) => void, reject: (payload: unknown) => void) => {
      const push: Push<T> = channel.push(message, payload)
      push.receive('ok', resolve)
      push.receive('error', reject)
    },
  )

export default {
  connectToChannel,
  disconect,
  join,
  listenTo,
  send,
}
