<script>
  import Button from './Button.svelte'

  export let header, code

  let exs = import.meta.glob('../examples/*.sclin', {
    eager: true,
    as: 'raw',
  })
</script>

<div panel>
  {#each Object.entries(exs) as [k, v]}
    <Button
      on:click={() => {
        header = ''
        code = v
      }}
    >
      {k.replace(/.*?(\w+)\.sclin$/g, '$1')}
    </Button>
  {/each}
</div>
