<script>
  import { createKeyStroke } from '@grail-ui/svelte'
  import { onMount } from 'svelte'
  import { source } from 'sveltekit-sse'

  import Brand from '$lib/Brand.svelte'
  import Button from '$lib/Button.svelte'
  import Code from '$lib/Code.svelte'
  import { compress, decompress } from '$lib/ffl'
  import Out from '$lib/Out.svelte'

  let code = ''
  let bytes = 0
  let out = ''

  let src
  $: stop = () => {
    if (src) {
      src.close()
      src = false
    }
  }

  let run = async () => {
    out = '[scline] running...\n\n'

    src = source('/run/' + (await compress(code)))
    src
      .onError(() => {
        stop()
      })
      .transform(async stream => {
        for await (let e of stream) {
          let [x, m] = JSON.parse(e)
          if (x < 0) stop()
          else out += await decompress(m)
        }
      })
  }

  createKeyStroke({
    key: ['ctrl+enter'],
    handler: run,
  })

  let permalink = async () => {
    history.pushState({}, '', `##${await compress(code)}`)
    let { href } = location
    out = `url: ${href}

ppcg.se:

# [sclin](https://github.com/molarmanful/sclin), ${bytes} bytes

\`\`\`
${code}
\`\`\`

[Try it here!](${href})`
  }

  onMount(async () => {
    let { hash } = location
    if (hash.startsWith('##')) code = await decompress(hash.slice(2))
  })
</script>

<div class="flex-(~ col) screen p-4">
  <header>
    <Brand />
    <div class="flex gap-4 mb-4">
      {#if src}
        <Button on:click={stop}>
          <i class="i-ic-outline-stop"></i> stop
        </Button>
      {:else}
        <Button on:click={run}>
          <i class="i-ic-outline-play-arrow"></i> run
        </Button>
      {/if}
      <Button on:click={permalink}>
        <i class="i-ic-outline-link"></i> link
      </Button>
    </div>
  </header>
  <main class="min-h-0 flex-(~ 1) lt-lg:flex-col gap-4">
    <Code bind:value={code} bind:bytes />
    <Out bind:value={out} />
  </main>
</div>

<style lang="postcss">
  main > :global(*) {
    @apply flex-1;
  }
</style>
