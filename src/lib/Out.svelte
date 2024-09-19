<script lang='ts'>
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  interface Props extends HTMLTextareaAttributes {
    value?: string
  }

  const { value = '', ...rest }: Props = $props()

  let el = $state<HTMLElement>()

  $effect(() => {
    ((_) => {})(value)

    requestAnimationFrame(() => {
      if (!el)
        return

      el.scrollTop = el.scrollHeight
    })
  })
</script>

<textarea
  bind:this={el}
  class='flex-1 ws-pre-wrap break-all'
  disabled
  placeholder='stdout...'
  spellcheck='false'
  {value}
  {...rest}
></textarea>
