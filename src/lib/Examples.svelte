<script>
  import Button from './Button.svelte'

  export let header, code, out

  let exs = import.meta.glob('../examples/*.sclin', {
    eager: true,
    as: 'raw',
  })
</script>

<div class="flex-(~ col) gap-4" panel>
  {#each Object.entries(exs) as [k, v]}
    <div>
      <Button
        on:click={() => {
          header = ''
          code = v
          out = ''
        }}
      >
        {k.replace(/.*?(\w+)\.sclin$/g, '$1')}
      </Button>
    </div>
  {/each}
</div>
