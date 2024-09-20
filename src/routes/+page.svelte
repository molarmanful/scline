<script lang='ts'>
  import type { Unsubscriber } from 'svelte/store'

  import { pushState } from '$app/navigation'
  import { About, Brand, Button, Code, Examples, Out, Perma } from '$lib'
  import { decompress, perm, unperm } from '$lib/ffl'
  import { source, type Source } from 'sveltekit-sse'

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

  let src = $state<Source>()
  let unsub = $state<Unsubscriber>()

  const stop = (done: boolean = false) => () => {
    unsub?.()

    if (src) {
      src.close()
      src = void 0
    }

    if (!done)
      out += '\n[scline: stopped]'
  }

  const run = async () => {
    tab = 'out'
    out = '[scline: loading...]'

    const xs = await perm([header, code, inp], '~')
    src = source(`/run`, {
      options: {
        body: xs,
      },
      error: stop(),
    })

    let fst = true
    unsub = src.select('msg').subscribe(async (e) => {
      if (!e)
        return
      if (fst) {
        out = ''
        fst = false
      }

      const [x, m] = JSON.parse(e)
      if (x < 0) {
        stop(true)()
        return
      }

      const o = await decompress(m)
      out += o
    })
  }

  const permalink = async () => {
    const l = await perm([header, code, inp])
    pushState(l, {})
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
  onkeydown={(e) => {
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
        <Button onclick={stop()}>
          <i class='i-ic-outline-stop'></i> stop
        </Button>
      {:else}
        <Button onclick={run}>
          <i class='i-ic-outline-play-arrow'></i> run
        </Button>
      {/if}
      <Button onclick={permalink}>
        <i class='i-ic-outline-link'></i> link
      </Button>
      <Button onclick={examples}>
        <i class='i-ic-outline-featured-play-list'></i> examples
      </Button>
      <Button onclick={abt}>
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
        <Examples
          code={x => code = x}
          header={x => header = x}
          out={x => out = x}
        />

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
