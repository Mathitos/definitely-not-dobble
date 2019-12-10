export type GameState = Player[]

export interface Player {
  player: string
  images: number[]
  cooldown: boolean
}
