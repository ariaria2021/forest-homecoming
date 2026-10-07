<script lang="ts">
  import { onMount } from 'svelte'
  import Board from './components/Board.svelte'
  import CompleteCard from './components/CompleteCard.svelte'
  import Village from './components/Village.svelte'
  import { canDepart, createGame, departCart, isCleared, stages, type GameState } from './lib/game'

  const SAVE_KEY = 'forest-homecoming-progress-v1'
  type SaveData = { unlockedStage: number; completed: number[] }

  let stageIndex = $state(0)
  let completed = $state<number[]>([])
  let game = $state<GameState>(createGame(stages[0]))
  let departingId = $state<string | null>(null)
  let notice = $state('')
  const stationLevel = $derived(completed.length >= 8 ? 2 : completed.length >= 3 ? 1 : 0)
  const acorns = $derived(completed.length * 3)
  const cleared = $derived(isCleared(game))

  const startStage = (index: number) => {
    stageIndex = index
    game = createGame(stages[index])
    departingId = null
    notice = ''
  }

  const persist = (nextCompleted = completed, unlockedStage = stageIndex) => {
    const data: SaveData = { unlockedStage: Math.min(unlockedStage, stages.length - 1), completed: nextCompleted }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  }

  const handleCart = (id: string) => {
    if (departingId || cleared) return
    if (!canDepart(game, id)) {
      game = departCart(game, id)
      notice = 'ほかのカートが道をふさいでいるよ。'
      return
    }
    departingId = id
    notice = ''
    window.setTimeout(() => {
      game = departCart(game, id)
      departingId = null
      if (isCleared(game) && !completed.includes(game.stage.id)) {
        const nextCompleted = [...completed, game.stage.id]
        completed = nextCompleted
        persist(nextCompleted, stageIndex + 1)
      }
    }, 340)
  }

  const retry = () => startStage(stageIndex)
  const nextStage = () => {
    if (stageIndex < stages.length - 1) startStage(stageIndex + 1)
  }

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null') as SaveData | null
      if (!saved || !Array.isArray(saved.completed)) return
      completed = saved.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= stages.length)
      startStage(Math.min(Math.max(saved.unlockedStage ?? 0, 0), stages.length - 1))
    } catch {
      localStorage.removeItem(SAVE_KEY)
    }
  })
</script>

<svelte:head><title>もりの帰り道</title><meta name="description" content="動物カートを帰して、どんぐり駅を育てる小さな交通パズル" /></svelte:head>

<main class="app-shell">
  <header class="topbar">
    <div><p class="brand-kicker">FOREST HOMECOMING</p><h1>もりの帰り道</h1></div>
    <button class="reset-button" onclick={retry} aria-label="このステージをやりなおす">↻<span>やりなおす</span></button>
  </header>

  <Village {stationLevel} {acorns} />

  <section class="stage-intro">
    <div><p class="eyebrow">STAGE {stageIndex + 1} / {stages.length}</p><h2>{game.stage.name}</h2></div>
    <div class="stage-dots" aria-label={`ステージ ${stageIndex + 1} / ${stages.length}`}>{#each stages as stage}<span class:done={completed.includes(stage.id)} class:active={stage.id === game.stage.id}></span>{/each}</div>
  </section>

  <p class="hint">{notice || game.stage.hint}</p>
  <Board {game} {departingId} onCart={handleCart} />

  <footer class="footer-note"><span>✦</span> みんなをおうちへ帰して、駅をきれいにしよう。</footer>

  {#if cleared}
    <CompleteCard stageNumber={game.stage.id} isLast={stageIndex === stages.length - 1} onNext={nextStage} onRetry={retry} />
  {/if}
</main>
