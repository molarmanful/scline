<script lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  interface Props extends HTMLAnchorAttributes {
    children: Snippet
  }

  const { children, ...rest }: Props = $props()
</script>

<a target='_blank' {...rest}>{@render children()}</a>
