import { describe, expect, it } from 'vitest'
import { canDepart, createGame, departCart, isCleared, stages, type GameState } from './game'

const canSolve = (state: GameState): boolean => {
  if (isCleared(state)) return true
  return state.carts.some((cart) => canDepart(state, cart.id) && canSolve(departCart(state, cart.id)))
}

describe('forest homecoming game engine', () => {
  it('allows a cart with an empty route to depart', () => {
    const state = createGame(stages[0])
    expect(canDepart(state, 'b1')).toBe(true)
    const next = departCart(state, 'b1')
    expect(next.carts.map((cart) => cart.id)).not.toContain('b1')
  })

  it('keeps a cart in place when another cart blocks its path', () => {
    const state = createGame(stages[0])
    expect(canDepart(state, 'f1')).toBe(false)
    const next = departCart(state, 'f1')
    expect(next.carts).toHaveLength(2)
    expect(next.blockedCartId).toBe('f1')
  })

  it('clears a stage when every cart has departed', () => {
    let state = createGame(stages[0])
    state = departCart(state, 'b1')
    state = departCart(state, 'f1')
    expect(isCleared(state)).toBe(true)
  })

  it('ships only solvable stage layouts', () => {
    for (const stage of stages) expect(canSolve(createGame(stage)), stage.name).toBe(true)
  })
})
