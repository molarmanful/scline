<script>
  export let value = ''
  export let bytes = 0

  $: bytes = new Blob([value]).size
</script>

<div parent {...$$restProps}>
  <textarea
    class="full ws-pre"
    placeholder="code..."
    spellcheck="false"
    bind:value
  ></textarea>
  <div class="corn">
    {bytes} bytes
  </div>
</div>

<style lang="postcss">
  [parent] {
    @apply relative;
  }
</style>
