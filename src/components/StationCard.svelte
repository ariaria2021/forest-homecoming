<script lang="ts">
  let { onPlayAgain }: { onPlayAgain: () => void } = $props()
</script>

<div class="complete-backdrop station-backdrop" role="presentation">
  <div class="station-card" role="dialog" aria-modal="true" aria-labelledby="station-title">
    <div class="station-sky"><span>✦</span><span>☁</span><span>✦</span></div>
    <div class="celebration">✦ ✦ ✦</div>
    <p class="eyebrow">FOREST STATION</p>
    <h2 id="station-title">どんぐり駅、完成！</h2>
    <p>みんなが無事に帰ってきて、<br />駅もすっかりにぎやかになったよ。</p>
    <div class="station-finale" aria-hidden="true"><span>🌲</span><b>🏠</b><span>🌲</span></div>
    <button class="primary-button finale-button" onclick={onPlayAgain}>最初からあそぶ</button>
  </div>
</div>
