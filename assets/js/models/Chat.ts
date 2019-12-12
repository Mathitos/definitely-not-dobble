import { ReceivedMessage } from '../utils/socket'

export type ChatLine = ReceivedMessage['message'] & {
  time: string
}
