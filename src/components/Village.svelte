<script lang="ts">
  import PixelSprite from './PixelSprite.svelte'
  let { stationLevel, acorns }: { stationLevel: number; acorns: number } = $props()

  const stationCopy = ['古い駅を直そう', '屋根ができた！', 'みんなのどんぐり駅']
</script>

<section class="village" aria-label="動物村の景色">
  <div class="sky-shine"></div>
  <div class="cloud cloud-one"></div>
  <div class="cloud cloud-two"></div>
  <div class="hills hill-back"></div>
  <div class="hills hill-front"></div>
  <div class="tree tree-left"><i></i><b></b></div>
  <div class="tree tree-right"><i></i><b></b></div>
  <div class:level-one={stationLevel >= 1} class:level-two={stationLevel >= 2} class="station">
    <div class="station-sign">駅</div>
    <div class="station-roof"></div>
    <div class="station-house"><span class="door"></span><span class="window"></span></div>
    {#if stationLevel >= 2}<span class="station-flag">★</span>{/if}
  </div>
  <div class="station-caption">{stationCopy[stationLevel]}</div>
  <div class="acorn-bank" aria-label={`どんぐり ${acorns}個`}><PixelSprite name="acorn" /> {acorns}</div>
</section>
