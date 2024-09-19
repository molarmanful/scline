<script>
  export let href = ''
  export let bytes = 0
  export let code = ''

  const copy = ({ target }) => {
    const s = getSelection()
    const r = document.createRange()
    r.selectNodeContents(target)
    s.removeAllRanges()
    s.addRange(r)

    navigator.clipboard.writeText(target.innerText)
  }
</script>

<div panel {...$$restProps}>
  <h2>url</h2>
  <p><button reset on:click|preventDefault={copy}><pre>{href}</pre></button></p>
  <br />
  <h2>golf</h2>
  <p>
    <button reset on:click|preventDefault={copy}>
      <pre>
# [sclin](https://github.com/molarmanful/sclin), {bytes} bytes

```
{code}
```

[Try it on scline!]({href})</pre>
    </button>
  </p>
</div>

<style lang='postcss'>
  button {
    @apply bg-transparent text-(inherit left) cursor-copy;
  }
  pre {
    @apply ws-pre-wrap break-all font-mono;
  }
</style>
