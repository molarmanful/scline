import extractorSvelte from '@unocss/extractor-svelte'
import {
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default {
  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetUno(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans1: [
          { name: 'Satoshi', weights: [400, 700], provider: 'fontshare' },
        ],
        mono: ['Fira Code'],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [],
  theme: {},
  rules: [],
  shortcuts: [
    ['border-line', 'border-(1 solid current)'],
    ['full', 'w-full h-full'],
    ['screen', 'w-screen h-screen'],
    ['max-full', 'max-w-full max-h-full'],
    ['max-screen', 'max-w-screen max-h-screen'],
    ['corn', 'absolute bottom-1 right-1 p-1 text-sm text-gray-400 bg-black/69'],
  ],
  extractors: [extractorSvelte],
}
