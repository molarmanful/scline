<script>
  export let value = ''
</script>

<textarea disabled placeholder="output..." bind:value {...$$restProps}
></textarea>

<style lang="postcss">
  textarea {
    @apply ws-pre-wrap break-all;
  }
</style>
