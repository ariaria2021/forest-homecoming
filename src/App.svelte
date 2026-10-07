<script lang="ts">
  import { onMount } from 'svelte'
  import Board from './components/Board.svelte'
  import CompleteCard from './components/CompleteCard.svelte'
  import StationCard from './components/StationCard.svelte'
  import StagePicker from './components/StagePicker.svelte'
  import Village from './components/Village.svelte'
  import VillageCard from './components/VillageCard.svelte'
  import { canDepart, createGame, departCart, isCleared, parFor, starsFor, stages, type GameState } from './lib/game'

  const SAVE_KEY = 'forest-homecoming-progress-v1'
  type SaveData = { unlockedStage: number; completed: number[]; bestMoves?: Record<number, number> }

  let stageIndex = $state(0)
  let completed = $state<number[]>([])
  let game = $state<GameState>(createGame(stages[0]))
  let departingId = $state<string | null>(null)
  let notice = $state('')
  let showStation = $state(false)
  let showVillage = $state(false)
  let showStages = $state(false)
  let moves = $state(0)
  let bestMoves = $state<Record<number, number>>({})
  const stationLevel = $derived(completed.length >= 8 ? 2 : completed.length >= 3 ? 1 : 0)
  const acorns = $derived(completed.length * 3)
  const cleared = $derived(isCleared(game))

  const startStage = (index: number) => {
    stageIndex = index
    game = createGame(stages[index])
    departingId = null
    notice = ''
    moves = 0
  }

  const persist = (nextCompleted = completed, unlockedStage = stageIndex, nextBestMoves = bestMoves) => {
    const data: SaveData = { unlockedStage: Math.min(unlockedStage, stages.length - 1), completed: nextCompleted, bestMoves: nextBestMoves }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  }

  const handleCart = (id: string) => {
    if (departingId || cleared) return
    moves += 1
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
        const nextBestMoves = { ...bestMoves, [game.stage.id]: moves }
        completed = nextCompleted
        bestMoves = nextBestMoves
        persist(nextCompleted, stageIndex + 1, nextBestMoves)
      } else if (isCleared(game)) {
        const previous = bestMoves[game.stage.id]
        if (!previous || moves < previous) {
          const nextBestMoves = { ...bestMoves, [game.stage.id]: moves }
          bestMoves = nextBestMoves
          persist(completed, stageIndex, nextBestMoves)
        }
      }
    }, 560)
  }

  const retry = () => startStage(stageIndex)
  const nextStage = () => {
    if (stageIndex < stages.length - 1) startStage(stageIndex + 1)
  }
  const visitStation = () => showStation = true
  const playAgain = () => {
    showStation = false
    startStage(0)
  }
  const chooseStage = (index: number) => {
    showStages = false
    startStage(index)
  }

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null') as SaveData | null
      if (!saved || !Array.isArray(saved.completed)) return
      completed = saved.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= stages.length)
      bestMoves = Object.fromEntries(Object.entries(saved.bestMoves ?? {}).filter(([id, moves]) => Number.isInteger(Number(id)) && typeof moves === 'number' && moves > 0))
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
    <div class="header-actions"><button class="map-button" onclick={() => showStages = true}>ステージ</button><button class="reset-button" onclick={retry} aria-label="このステージをやりなおす">↻<span>やりなおす</span></button></div>
  </header>

  <button class="village-button" onclick={() => showVillage = true} aria-label="動物村を見る"><Village {stationLevel} {acorns} /></button>

  <section class="stage-intro">
    <div><p class="eyebrow">STAGE {stageIndex + 1} / {stages.length}</p><h2>{game.stage.name}</h2><small class="move-count">手数 {moves} / ★3 {parFor(game.stage)}</small></div>
    <div class="stage-dots" aria-label={`ステージ ${stageIndex + 1} / ${stages.length}`}>{#each stages as stage}<span class:done={completed.includes(stage.id)} class:active={stage.id === game.stage.id}></span>{/each}</div>
  </section>

  <p class="hint">{notice || game.stage.hint}</p>
  <Board {game} {departingId} onCart={handleCart} />

  <footer class="footer-note">村を育てながら、少ない手数で帰そう。</footer>

  {#if cleared && !showStation}
    <CompleteCard stageNumber={game.stage.id} isLast={stageIndex === stages.length - 1} {moves} stars={starsFor(moves, game.stage)} onNext={stageIndex === stages.length - 1 ? visitStation : nextStage} onRetry={retry} />
  {/if}
  {#if showStation}
    <StationCard onPlayAgain={playAgain} />
  {/if}
  {#if showVillage}
    <VillageCard completedCount={completed.length} onClose={() => showVillage = false} />
  {/if}
  {#if showStages}
    <StagePicker unlockedStage={Math.max(completed.length, stageIndex)} {bestMoves} onChoose={chooseStage} onClose={() => showStages = false} />
  {/if}
</main>
