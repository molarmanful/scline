<script>
  import { createKeyStroke } from '@grail-ui/svelte'
  import { onMount } from 'svelte'

  import Brand from '$lib/Brand.svelte'
  import Button from '$lib/Button.svelte'
  import Code from '$lib/Code.svelte'
  import { compress, decompress } from '$lib/ffl'
  import Out from '$lib/Out.svelte'

  let code = ''
  let bytes = 0
  let out = ''

  let run = () => {}

  createKeyStroke({
    key: ['ctrl+enter'],
    handler: run,
  })

  let permalink = () => {
    compress(code, data => {
      history.pushState({}, '', data)
      let { href } = location
      out = `url: ${href}

ppcg:

# [sclin](https://github.com/molarmanful/sclin), ${bytes} bytes

\`\`\`
${code}
\`\`\`

[Try it here!](${href})`
    })
  }

  onMount(() => {
    let { hash } = location
    if (hash.startsWith('##'))
      decompress(hash, data => {
        code = data
      })
  })
</script>

<div class="flex-(~ col) screen p-4">
  <header>
    <Brand />
    <div class="flex gap-4 mb-4">
      <Button on:click={run}>
        <i class="i-ic-outline-play-arrow"></i> run
      </Button>
      <Button on:click={permalink}>
        <i class="i-ic-outline-link"></i> permalink
      </Button>
    </div>
  </header>
  <main class="flex-(~ 1) lt-lg:flex-col gap-4">
    <Code bind:value={code} bind:bytes />
    <Out bind:value={out} />
  </main>
</div>

<style lang="postcss">
  main > :global(*) {
    @apply flex-1;
  }
</style>
