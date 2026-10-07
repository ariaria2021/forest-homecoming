<script lang="ts">
  import type { Cart, Direction, GameState } from '../lib/game'

  let { game, departingId, onCart }: { game: GameState; departingId: string | null; onCart: (id: string) => void } = $props()

  const arrow: Record<Direction, string> = { up: '↑', right: '→', down: '↓', left: '←' }
  const animal: Record<Cart['animal'], string> = { fox: '🦊', bunny: '🐰', bear: '🐻', cat: '🐱' }

  const cartStyle = (item: Cart) => {
    const vertical = item.direction === 'up' || item.direction === 'down'
    const length = item.length ?? 1
    const rowEnd = vertical ? item.row + length : item.row + 1
    const colEnd = vertical ? item.col + 1 : item.col + length
    return `grid-row:${item.row + 1} / ${rowEnd + 1}; grid-column:${item.col + 1} / ${colEnd + 1}; --direction:${item.direction};`
  }
</script>

<section class="board-wrap">
  <div class="board-label"><span>森の広場</span><small>{game.carts.length} 台のおかえり</small></div>
  <div
    class="board"
    style={`--rows:${game.stage.rows}; --cols:${game.stage.cols};`}
    aria-label={`${game.stage.name}の盤面`}
  >
    {#each Array(game.stage.rows * game.stage.cols) as _, index}
      <span class="grass-cell" aria-hidden="true" style={`grid-row:${Math.floor(index / game.stage.cols) + 1};grid-column:${(index % game.stage.cols) + 1}`}></span>
    {/each}
    {#each game.carts as item (item.id)}
      <button
        class:blocked={game.blockedCartId === item.id}
        class:departing={departingId === item.id}
        class={`cart ${item.animal} ${item.direction}`}
        style={cartStyle(item)}
        onclick={() => onCart(item.id)}
        aria-label={`${animal[item.animal]}のカートを${arrow[item.direction]}へ帰す`}
      >
        <span class="cart-animal">{animal[item.animal]}</span>
        <span class="cart-arrow">{arrow[item.direction]}</span>
      </button>
    {/each}
  </div>
  {#if game.blockedCartId}
    <p class="board-message">その先は通れないみたい…</p>
  {:else}
    <p class="board-message">カートをタップして、おうちへ帰そう。</p>
  {/if}
</section>
