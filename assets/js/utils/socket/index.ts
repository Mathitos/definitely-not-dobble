import { Socket } from 'phoenix'
import { GameState } from '../../models/GameState'

export type Channel = {
  join: () => Push<'join'>
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
    (status: 'ok', callback: (payload: ResponseMessage[T]) => void): Push<T>
    (status: 'error', callback: (payload: unknown) => void): Push<T>
    (status: 'timeout', callback: (payload: unknown) => void): Push<T>
  }
}

export type SendMessage = {
  join: never
  message: { text: string }
  get_game_state: null
  guess: { number: number }
}

export type ResponseMessage = {
  join: { id: number }
  message: void
  get_game_state: GameState
  guess: { response: 'right' | 'wrong' }
}

export type ReceivedMessage = {
  message: { user_name: string; text: string }
  game_state_update: { game_state: GameState }
}

const socket = new Socket('/socket', { params: { user_token: 'user_token_test' } })
socket.connect()

const connectToChannel = (channelName: string, userName: string): Channel =>
  socket.channel(channelName, { name: userName })

const join = (channel: Channel): Promise<ResponseMessage['join']> =>
  new Promise(
    (resolve: (payload: ResponseMessage['join']) => void, reject?: (payload: unknown) => void) => {
      channel
        .join()
        .receive('ok', (resp) => {
          resolve(resp)
        })
        .receive('error', (resp) => {
          reject ? reject(resp) : console.log('Unable to join on channel', resp)
        })
        .receive('timeout', (resp) =>
          reject ? reject(resp) : console.log('Networking issue. Still waiting...'),
        )
    },
  )

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
      channel
        .push(message, payload)
        .receive('ok', resolve)
        .receive('error', reject)
    },
  )

export default {
  connectToChannel,
  disconect,
  join,
  listenTo,
  send,
}
