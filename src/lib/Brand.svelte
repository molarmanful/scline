<h1><span a>sc</span>lin<span b>e</span></h1>

<style lang='postcss'>
  h1 {
    @apply inline-block;

    span {
      @apply transition-color-400;
    }

    &:not(:hover) [b] {
      @apply text-gray-500;
    }

    &:hover [a] {
      @apply text-gray-500;
    }
  }
</style>
