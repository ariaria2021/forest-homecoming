<script lang="ts">
  import { sprites, type SpriteName } from '../lib/sprites'

  let { name, label = '', className = '' }: { name: SpriteName; label?: string; className?: string } = $props()
  const pixels = $derived(sprites[name])
</script>

<svg class={`pixel-sprite ${className}`} viewBox="0 0 10 10" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} shape-rendering="crispEdges">
  {#each pixels as pixel}
    <rect x={pixel.x} y={pixel.y} width="1" height="1" fill={pixel.color}></rect>
  {/each}
</svg>
