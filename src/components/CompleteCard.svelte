<script lang="ts">
  let { stageNumber, isLast, onNext, onRetry }: { stageNumber: number; isLast: boolean; onNext: () => void; onRetry: () => void } = $props()
</script>

<div class="complete-backdrop" role="presentation">
  <div class="complete-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
    <div class="celebration">✦ ✦ ✦</div>
    <p class="eyebrow">STAGE {stageNumber} CLEAR</p>
    <h2 id="complete-title">みんな、ただいま！</h2>
    <p>どんぐりを <strong>3こ</strong> ひろったよ。</p>
    <div class="complete-actions">
      <button class="secondary-button" onclick={onRetry}>もう一度</button>
      <button class="primary-button" onclick={onNext}>{isLast ? '駅を見に行く' : 'つぎの帰り道'}</button>
    </div>
  </div>
</div>
