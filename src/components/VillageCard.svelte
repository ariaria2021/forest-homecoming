<script lang="ts">
  import PixelSprite from './PixelSprite.svelte'

  let { completedCount, onClose }: { completedCount: number; onClose: () => void } = $props()
  const level = $derived(completedCount >= 8 ? 3 : completedCount >= 6 ? 2 : completedCount >= 3 ? 1 : 0)
  const copy = ['まずは駅を直そう', 'ベンチが置かれたよ', '花屋が開いたよ', 'みんなの駅が完成！']
</script>

<div class="complete-backdrop village-backdrop" role="presentation">
  <div class="village-card" role="dialog" aria-modal="true" aria-labelledby="village-title">
    <div class="picker-header"><div><p class="eyebrow">FOREST VILLAGE</p><h2 id="village-title">動物村</h2></div><button class="close-button" onclick={onClose} aria-label="村の画面を閉じる">×</button></div>
    <p class="village-copy">{copy[level]}</p>
    <div class="village-scene level-{level}">
      <PixelSprite name="tree" className="scene-tree left-tree" />
      <PixelSprite name="house" className="scene-house" />
      <PixelSprite name="tree" className="scene-tree right-tree" />
      {#if level >= 1}<PixelSprite name="bench" className="scene-bench" />{/if}
      {#if level >= 2}<PixelSprite name="flower" className="scene-flower one" /><PixelSprite name="flower" className="scene-flower two" />{/if}
      {#if level >= 3}<span class="scene-banner">ようこそ</span>{/if}
    </div>
    <p class="village-progress">クリア {completedCount} / 8</p>
  </div>
</div>
