<script>
  export let value = ''

  let el
  let scrollB = () => {
    if (el)
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight
      })
  }
  $: value, scrollB()
</script>

<textarea
  bind:this={el}
  class="ws-pre-wrap break-all"
  disabled
  placeholder="output..."
  spellcheck="false"
  bind:value
  {...$$restProps}
></textarea>
