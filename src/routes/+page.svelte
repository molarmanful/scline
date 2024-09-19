<script lang='ts'>
  import { onMount } from 'svelte'
  import { About, Brand, Button, Code, Examples, Out, Perma } from '$lib'
  import { decompress, perm, unperm } from '$lib/ffl'

  import { source } from 'sveltekit-sse'

  let href = ''
  let code = ''
  let header = ''
  let inp = ''
  let bytes = 0

  let out = ''

  let state = 'out'
  $: {
    ((_) => {})([code, header, inp])
    state = 'out'
  }

  let src
  let force = false
  $: stop = () => {
    if (src) {
      src.close()
      src = false
    }
  }

  const run = async () => {
    state = 'out'
    out = '[scline: loading...]'

    const xs = await perm([header, code, inp], '~')
    src = source(`/run/${xs}`)
    src
      .onError(() => {
        stop()
      })
      .transform(async (stream) => {
        let fst = true
        for await (const e of stream) {
          if (fst) {
            out = ''
            fst = false
          }
          if (force) {
            force = false
            break
          }
          const [x, m] = JSON.parse(e)
          if (x < 0) {
            stop()
            break
          }
          const o = await decompress(m)
          out += o
        }
      })
  }

  const permalink = async () => {
    const l = await perm([header, code, inp])
    history.pushState({}, '', l)
    href = location.href
    state = 'perma'
  }

  const abt = () => {
    state = 'abt'
  }

  const examples = () => {
    state = 'exs'
  }

  onMount(async () => {
    const { hash } = location
    if (hash.startsWith('#')) {
      [header, code, inp] = await unperm(hash)
    }
  })
</script>

<svelte:window
  on:keydown={(e) => {
    switch (e.key) {
      case 'Enter':
        if (!e.ctrlKey)
          break
        e.preventDefault()
        run()
        break
      case 's':
        if (!e.ctrlKey)
          break
        e.preventDefault()
        permalink()
        break
    }
  }}
/>

<div class='screen flex flex-(col) p-4'>
  <header>
    <Brand />
    <div class='mb-4 flex gap-4'>
      {#if src}
        <Button
          on:click={() => {
            force = true
            stop()
          }}
        >
          <i class='i-ic-outline-stop'></i> stop
        </Button>
      {:else}
        <Button on:click={run}>
          <i class='i-ic-outline-play-arrow'></i> run
        </Button>
      {/if}
      <Button on:click={permalink}>
        <i class='i-ic-outline-link'></i> link
      </Button>
      <Button on:click={examples}>
        <i class='i-ic-outline-featured-play-list'></i> examples
      </Button>
      <Button on:click={abt}>
        <i class='i-ic-outline-info'></i> about
      </Button>
    </div>
  </header>

  <main class='min-h-0 flex flex-1 gap-4 [&>*]:(flex flex-1 flex-col gap-4) lt-lg:flex-col'>
    <div>
      <Code
        bytec={false}
        clazz='h-1/6'
        placeholder='header...'
        bind:value={header}
      />
      <Code clazz='flex-1' f={x => bytes = x()} bind:value={code} />
    </div>

    <div>
      {#if state === 'perma'}
        <Perma {bytes} {code} {href} />
      {:else if state === 'exs'}
        <Examples bind:header bind:code bind:out />
      {:else if state === 'abt'}
        <About />
      {:else}
        <Code
          bytec={false}
          clazz='h-1/6'
          placeholder='stdin...'
          bind:value={inp}
        />
        <Out value={out} />
      {/if}
    </div>
  </main>
</div>
