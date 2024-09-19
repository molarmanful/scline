<script lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends HTMLButtonAttributes {
    children: Snippet
  }

  const { children, ...rest }: Props = $props()
</script>

<button onclick={e => (e.target as HTMLElement).blur()} {...rest}>
  {@render children()}
</button>
