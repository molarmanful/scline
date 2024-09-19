<script lang='ts'>
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string
    bytec?: boolean
    placeholder?: string
    clazz?: string
    f?: (bytes: () => number) => void
  }

  let { value = $bindable(''), bytec = true, f = () => {}, placeholder = 'code...', clazz = '', ...rest }: Props = $props()

  const bytes = $derived(new Blob([value]).size)
  f(() => bytes)
</script>

<div class='{clazz} relative' {...rest}>
  <textarea class='full ws-pre' {placeholder} spellcheck='false' bind:value></textarea>

  {#if bytec}
    <div class='corn'>{bytes} bytes</div>
  {/if}
</div>
