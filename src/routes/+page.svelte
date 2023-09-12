<script>
  import { createKeyStroke } from '@grail-ui/svelte'
  import { onMount } from 'svelte'
  import { source } from 'sveltekit-sse'

  import About from '$lib/About.svelte'
  import Brand from '$lib/Brand.svelte'
  import Button from '$lib/Button.svelte'
  import Code from '$lib/Code.svelte'
  import Examples from '$lib/Examples.svelte'
  import { decompress, perm, unperm } from '$lib/ffl'
  import Out from '$lib/Out.svelte'
  import Perma from '$lib/Perma.svelte'

  let href = ''
  let code = ''
  let header = ''
  let inp = ''
  let bytes = 0

  let out = ''

  let state = 'out'
  $: code, header, inp, (state = 'out')

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
    out = '[scline: loading...]'

    let xs = await perm([header, code, inp], '~')
    src = source('/run/' + xs)
    src
      .onError(() => {
        stop()
      })
      .transform(async stream => {
        let fst = true
        for await (let e of stream) {
          if (fst) {
            out = ''
            fst = false
          }
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
    let l = await perm([header, code, inp])
    history.pushState({}, '', l)
    href = location.href
    state = 'perma'
  }

  createKeyStroke({
    key: ['ctrl+s'],
    handler: permalink,
  })

  let abt = () => {
    state = 'abt'
  }

  let examples = () => {
    state = 'exs'
  }

  onMount(async () => {
    let { hash } = location
    if (hash.startsWith`#`) {
      ;[header, code, inp] = await unperm(hash)
    }
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
      <Button on:click={examples}>
        <i class="i-ic-outline-featured-play-list"></i> examples
      </Button>
      <Button on:click={abt}>
        <i class="i-ic-outline-info"></i> about
      </Button>
    </div>
  </header>
  <main class="min-h-0 flex-(~ 1) lt-lg:flex-col gap-4">
    <div>
      <Code
        class="h-1/6"
        bytec={false}
        placeholder="header..."
        bind:value={header}
      />
      <Code class="flex-1" bind:value={code} bind:bytes />
    </div>
    <div>
      {#if state == 'perma'}
        <Perma {bytes} {code} {href} />
      {:else if state == 'exs'}
        <Examples bind:header bind:code bind:out />
      {:else if state == 'abt'}
        <About />
      {:else}
        <Code
          class="h-1/6"
          bytec={false}
          placeholder="stdin..."
          bind:value={inp}
        />
        <Out value={out} />
      {/if}
    </div>
  </main>
</div>

<style lang="postcss">
  main > :global(*) {
    --at-apply: 'flex-(~ 1 col) gap-4';
  }
</style>
