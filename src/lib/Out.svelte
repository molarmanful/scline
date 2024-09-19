<script>
  export let value = ''

  let el
  const scrollB = () => {
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight
      })
    }
  }
  $: value, scrollB()
</script>

<textarea
  bind:this={el}
  class='flex-1 ws-pre-wrap break-all'
  disabled
  placeholder='stdout...'
  spellcheck='false'
  {value}
  {...$$restProps}
></textarea>
