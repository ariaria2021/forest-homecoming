<script lang="ts">
  import { parFor, stages } from '../lib/game'

  let { unlockedStage, bestMoves, onChoose, onClose }: { unlockedStage: number; bestMoves: Record<number, number>; onChoose: (index: number) => void; onClose: () => void } = $props()
  const stars = (id: number) => {
    const moves = bestMoves[id]
    if (!moves) return 0
    const par = parFor(stages[id - 1])
    return moves <= par ? 3 : moves <= par + 2 ? 2 : 1
  }
</script>

<div class="complete-backdrop picker-backdrop" role="presentation">
  <div class="picker-card" role="dialog" aria-modal="true" aria-labelledby="picker-title">
    <div class="picker-header"><div><p class="eyebrow">STAGE MAP</p><h2 id="picker-title">帰り道をえらぶ</h2></div><button class="close-button" onclick={onClose} aria-label="ステージ選択を閉じる">×</button></div>
    <div class="stage-grid">
      {#each stages as stage, index}
        <button class:locked={index > unlockedStage} class="stage-choice" disabled={index > unlockedStage} onclick={() => onChoose(index)}>
          <span>{index > unlockedStage ? '—' : stage.id}</span>
          <small>{index > unlockedStage ? 'まだ行けない' : `${'★'.repeat(stars(stage.id))}${'☆'.repeat(3 - stars(stage.id))}`}</small>
        </button>
      {/each}
    </div>
  </div>
</div>
