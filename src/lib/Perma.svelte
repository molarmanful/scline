<script lang='ts'>
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    href: string
    bytes: number
    code: string
  }

  const { href = '', bytes = 0, code = '', ...rest }: Props = $props()

  const copy = (e: Event) => {
    e.preventDefault()

    const el = e.target as HTMLElement
    const s = getSelection()
    const r = document.createRange()

    r.selectNodeContents(el)
    s?.removeAllRanges()
    s?.addRange(r)

    navigator.clipboard.writeText(el.textContent ?? '')
  }
</script>

<div data-panel {...rest}>
  <h2>url</h2>
  <div data-p><button data-reset onclick={copy}><pre>{href}</pre></button></div>
  <br />
  <h2>golf</h2>
  <div data-p>
    <button data-reset onclick={copy}>
      <pre>
# [sclin](https://github.com/molarmanful/sclin), {bytes} bytes

```
{code}
```

[Try it on scline!]({href})</pre>
    </button>
  </div>
</div>

<style>
  button {
    @apply bg-transparent text-(inherit left) cursor-copy;
  }
  pre {
    @apply ws-pre-wrap break-all font-mono;
  }
</style>
