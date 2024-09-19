<script lang='ts'>
  import { About, Brand, Button, Code, Examples, Out, Perma } from '$lib'
  import { decompress, perm, unperm } from '$lib/ffl'
  import { source } from 'sveltekit-sse'

  let href = $state('')
  let code = $state('')
  let header = $state('')
  let inp = $state('')
  let bytes = $state(0)

  let out = $state('')

  let tab = $state('out')
  $effect(() => {
    ((_) => {})([code, header, inp])
    tab = 'out'
  })

  let src = $state<ReturnType<typeof source> | false>()
  let force = false
  const stop = () => {
    if (!src)
      return
    src.close()
    src = false
  }

  const run = async () => {
    tab = 'out'
    out = '[scline: loading...]'

    const xs = await perm([header, code, inp], '~')
    src = source(`/run/${xs}`, {
      error: stop,
    })

    let fst = true
    const unsub = src.select('msg').subscribe(async (e) => {
      if (fst) {
        out = ''
        fst = false
      }
      if (force) {
        force = false
        unsub()
      }

      const [x, m] = JSON.parse(e)
      if (x < 0) {
        stop()
        unsub()
      }

      const o = await decompress(m)
      out += o
    })
  }

  const permalink = async () => {
    const l = await perm([header, code, inp])
    history.pushState({}, '', l)
    href = location.href
    tab = 'perma'
  }

  const abt = () => {
    tab = 'abt'
  }

  const examples = () => {
    tab = 'exs'
  }

  $effect(() => {
    const { hash } = location
    if (!hash.startsWith('#'))
      return

    (async () => {
      [header, code, inp] = await unperm(hash)
    })()
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

<div class='screen flex flex-col p-4'>
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
        clazz='h-1/6'
        placeholder='header...'
        bind:value={header}
      />

      <Code
        bytec={true}
        clazz='flex-1'
        f={x => bytes = x()}
        bind:value={code}
      />
    </div>

    <div>
      {#if tab === 'perma'}
        <Perma {bytes} {code} {href} />

      {:else if tab === 'exs'}
        <Examples bind:header bind:code bind:out />

      {:else if tab === 'abt'}
        <About />

      {:else}
        <Code
          clazz='h-1/6'
          placeholder='stdin...'
          bind:value={inp}
        />
        <Out value={out} />

      {/if}
    </div>
  </main>
</div>
