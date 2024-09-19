<script lang='ts'>
  import type { Snippet } from 'svelte'

  import '@unocss/reset/tailwind-compat.css'
  import 'uno.css'
  import '../app.css'

  interface Props {
    children: Snippet
  }

  const { children }: Props = $props()

  let loaded = $state(false)

  $effect(() => {
    loaded = true
  })
</script>

<svelte:head>
  <title>scline</title>
</svelte:head>

<div class="{loaded ? 'opacity-100' : 'opacity-0'} transition-opacity-400">
  {@render children()}
</div>
