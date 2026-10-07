<script lang="ts">
  let { stageNumber, isLast, moves, stars, onNext, onRetry }: { stageNumber: number; isLast: boolean; moves: number; stars: number; onNext: () => void; onRetry: () => void } = $props()
</script>

<div class="complete-backdrop" role="presentation">
  <div class="complete-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
    <div class="celebration">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
    <p class="eyebrow">STAGE {stageNumber} CLEAR</p>
    <h2 id="complete-title">みんな、ただいま！</h2>
    <p><strong>{moves}手</strong> でクリア！ どんぐりを3こひろったよ。</p>
    <div class="complete-actions">
      <button class="secondary-button" onclick={onRetry}>もう一度</button>
      <button class="primary-button" onclick={onNext}>{isLast ? '駅を見に行く' : 'つぎの帰り道'}</button>
    </div>
  </div>
</div>
