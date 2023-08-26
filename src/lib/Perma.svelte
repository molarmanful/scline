<script>
  export let href = ''
  export let bytes = 0
  export let code = ''

  let copy = ({ target }) => {
    let s = getSelection()
    let r = document.createRange()
    r.selectNodeContents(target)
    s.removeAllRanges()
    s.addRange(r)

    navigator.clipboard.writeText(target.innerText)
  }
</script>

<pre class="ws-pre-wrap break-all" {...$$restProps}>
<h2>url</h2>
<button reset on:click={copy}>{href}</button>


<h2>golf</h2>
<button reset on:click={copy}
    ># [sclin](https://github.com/molarmanful/sclin), {bytes} bytes
```
{code}
```

[Try it on scline!]({href})</button
  >
</pre>

<style lang="postcss">
  h2 {
    @apply font-sans1 text-(gray-300 3xl);
  }

  button {
    @apply bg-transparent text-(inherit left) cursor-copy;
  }
</style>
