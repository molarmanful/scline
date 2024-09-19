<script>
  export let value = ''
  export let bytec = true
  export let bytes = 0
  export let placeholder = 'code...'

  $: bytes = new Blob([value]).size
</script>

<div parent {...$$restProps}>
  <textarea class='full ws-pre' {placeholder} spellcheck='false' bind:value
  ></textarea>
  {#if bytec}
    <div class='corn'>
      {bytes} bytes
    </div>
  {/if}
</div>

<style lang='postcss'>
  [parent] {
    @apply relative;
  }
</style>
