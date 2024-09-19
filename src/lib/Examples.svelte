<script lang='ts'>
  import { Button } from '.'

  interface Props {
    header: string
    code: string
    out: string
  }

  let {
    header = $bindable(),
    code = $bindable(),
    out = $bindable(),
  }: Props = $props()

  const exs = import.meta.glob<string>('../examples/*.sclin', {
    eager: true,
    import: 'default',
    query: '?raw',
  })
</script>

<div class='flex flex-(col) gap-4' data-panel>
  {#each Object.entries(exs) as [k, v]}
    <div>
      <Button
        on:click={() => {
          header = ''
          code = v
          out = ''
        }}
      >
        {k.match(/\/([^/]+)\.sclin$/)?.[1]}
      </Button>
    </div>
  {/each}
</div>
