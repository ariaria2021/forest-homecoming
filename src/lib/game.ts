export type Direction = 'up' | 'right' | 'down' | 'left'
export type Animal = 'fox' | 'bunny' | 'bear' | 'cat'

export type Cart = {
  id: string
  animal: Animal
  direction: Direction
  row: number
  col: number
  length?: number
}

export type Stage = {
  id: number
  name: string
  hint: string
  rows: number
  cols: number
  carts: Cart[]
  par?: number
}

export type GameState = {
  stage: Stage
  carts: Cart[]
  departed: string[]
  blockedCartId: string | null
}

const cart = (id: string, animal: Animal, direction: Direction, row: number, col: number, length = 1): Cart => ({ id, animal, direction, row, col, length })

export const stages: Stage[] = [
  { id: 1, name: 'はじめての帰り道', hint: '矢印の先に道が空いているカートをタップしよう。', rows: 4, cols: 4, carts: [cart('f1', 'fox', 'up', 2, 1), cart('b1', 'bunny', 'right', 1, 1)] },
  { id: 2, name: 'おやつの時間', hint: '先に小さなカートを帰すと、道がひらけるよ。', rows: 4, cols: 4, carts: [cart('f1', 'fox', 'up', 2, 1), cart('c1', 'cat', 'right', 1, 1), cart('b1', 'bunny', 'right', 1, 3)] },
  { id: 3, name: 'きのこの広場', hint: '出口までまっすぐ進める順番を見つけよう。', rows: 5, cols: 5, carts: [cart('b1', 'bear', 'down', 0, 2, 2), cart('f1', 'fox', 'right', 2, 0), cart('c1', 'cat', 'up', 4, 3), cart('b2', 'bunny', 'left', 1, 4)] },
  { id: 4, name: '雨あがりの坂道', hint: '大きなバスも、向きが合えばひと息で帰れる。', rows: 5, cols: 5, carts: [cart('b1', 'bear', 'right', 2, 0, 2), cart('f1', 'fox', 'up', 3, 1), cart('c1', 'cat', 'left', 1, 4), cart('b2', 'bunny', 'down', 0, 3)] },
  { id: 5, name: 'どんぐり市場', hint: '動かせるカートから、少しずつ出口を増やそう。', rows: 5, cols: 5, carts: [cart('f1', 'fox', 'right', 3, 0), cart('b1', 'bunny', 'up', 4, 2), cart('c1', 'cat', 'left', 2, 4), cart('b2', 'bear', 'down', 0, 1, 2), cart('f2', 'fox', 'up', 2, 3)] },
  { id: 6, name: '森のバス停', hint: '長いカートがどの道をふさいでいるか見てみよう。', rows: 6, cols: 6, carts: [cart('b1', 'bear', 'right', 2, 0, 3), cart('f1', 'fox', 'up', 4, 1), cart('c1', 'cat', 'left', 1, 5), cart('b2', 'bunny', 'down', 0, 4), cart('f2', 'fox', 'right', 5, 2)] },
  { id: 7, name: '夕焼け交差点', hint: '帰り道はひとつじゃない。出口の近さも手がかり。', rows: 6, cols: 6, carts: [cart('f1', 'fox', 'up', 4, 2), cart('b1', 'bunny', 'left', 2, 5), cart('c1', 'cat', 'down', 0, 1), cart('b2', 'bear', 'right', 3, 0, 2), cart('f2', 'fox', 'left', 5, 4), cart('b3', 'bunny', 'up', 1, 3)] },
  { id: 8, name: 'みんなの駅前', hint: '駅のお祝いまで、あと少し。最後の帰り道を整えよう。', rows: 6, cols: 6, carts: [cart('b1', 'bear', 'down', 0, 2, 2), cart('f1', 'fox', 'right', 2, 0), cart('c1', 'cat', 'up', 5, 4), cart('b2', 'bunny', 'left', 3, 5), cart('f2', 'fox', 'down', 1, 1), cart('b3', 'bunny', 'right', 4, 1), cart('c2', 'cat', 'left', 0, 5)] },
]

export const createGame = (stage: Stage): GameState => ({ stage, carts: stage.carts.map((item) => ({ ...item })), departed: [], blockedCartId: null })

const occupiedCells = (carts: Cart[]): Set<string> => {
  const cells = new Set<string>()
  for (const item of carts) {
    for (let offset = 0; offset < (item.length ?? 1); offset += 1) {
      const row = item.row + (item.direction === 'up' || item.direction === 'down' ? offset : 0)
      const col = item.col + (item.direction === 'left' || item.direction === 'right' ? offset : 0)
      cells.add(`${row}:${col}`)
    }
  }
  return cells
}

const pathCells = (item: Cart, stage: Stage): string[] => {
  const cells: string[] = []
  const length = item.length ?? 1
  let row = item.row
  let col = item.col
  if (item.direction === 'up') row -= 1
  if (item.direction === 'down') row += length
  if (item.direction === 'left') col -= 1
  if (item.direction === 'right') col += length
  while (row >= 0 && row < stage.rows && col >= 0 && col < stage.cols) {
    cells.push(`${row}:${col}`)
    if (item.direction === 'up') row -= 1
    if (item.direction === 'down') row += 1
    if (item.direction === 'left') col -= 1
    if (item.direction === 'right') col += 1
  }
  return cells
}

export const canDepart = (state: GameState, id: string): boolean => {
  const item = state.carts.find((candidate) => candidate.id === id)
  if (!item) return false
  const others = occupiedCells(state.carts.filter((candidate) => candidate.id !== id))
  return pathCells(item, state.stage).every((cell) => !others.has(cell))
}

export const departCart = (state: GameState, id: string): GameState => {
  if (!canDepart(state, id)) return { ...state, blockedCartId: id }
  return { ...state, carts: state.carts.filter((item) => item.id !== id), departed: [...state.departed, id], blockedCartId: null }
}

export const isCleared = (state: GameState): boolean => state.carts.length === 0

export const parFor = (stage: Stage): number => stage.par ?? stage.carts.length

export const starsFor = (moves: number, stage: Stage): 1 | 2 | 3 => {
  const par = parFor(stage)
  if (moves <= par) return 3
  if (moves <= par + 2) return 2
  return 1
}
