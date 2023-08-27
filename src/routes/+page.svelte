<script>
  import { createKeyStroke } from '@grail-ui/svelte'
  import { onMount } from 'svelte'
  import { source } from 'sveltekit-sse'

  import Brand from '$lib/Brand.svelte'
  import Button from '$lib/Button.svelte'
  import Code from '$lib/Code.svelte'
  import { compress, decompress } from '$lib/ffl'
  import Out from '$lib/Out.svelte'
  import Perma from '$lib/Perma.svelte'

  let href = ''
  let code = ''
  let bytes = 0

  let out = ''

  let state = 'out'
  $: code, (state = 'out')

  let src
  let force = false
  $: stop = () => {
    if (src) {
      src.close()
      src = false
    }
  }

  let run = async () => {
    state = 'out'
    out = ''

    let cc = await compress(code)
    src = source('/run/' + cc)
    src
      .onError(() => {
        stop()
      })
      .transform(async stream => {
        for await (let e of stream) {
          if (force) {
            force = false
            break
          }
          let [x, m] = JSON.parse(e)
          if (x < 0) {
            stop()
            break
          }
          let o = await decompress(m)
          out += o
        }
      })
  }

  createKeyStroke({
    key: ['ctrl+enter'],
    handler: run,
  })

  let permalink = async () => {
    history.pushState({}, '', `##${await compress(code)}`)
    href = location.href
    state = 'perma'
  }

  createKeyStroke({
    key: ['ctrl+s'],
    handler: permalink,
  })

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
        <Button on:click={((force = true), stop())}>
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
    {#if state == 'perma'}
      <Perma {bytes} {code} {href} />
    {:else}
      <Out value={out} />
    {/if}
  </main>
</div>

<style lang="postcss">
  main > :global(*) {
    @apply flex-1;
  }
</style>
