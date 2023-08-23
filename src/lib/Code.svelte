<script>
  export let value = ''
  export let bytes = 0

  $: bytes = new Blob([value]).size
</script>

<div parent {...$$restProps}>
  <textarea class="full" placeholder="code..." bind:value></textarea>
  <div class="absolute z-10 bottom-2 right-2 text-sm text-gray-400">
    {bytes} bytes
  </div>
</div>

<style lang="postcss">
  [parent] {
    @apply relative;
  }

  textarea {
    @apply full;
  }
</style>
