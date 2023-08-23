import * as ffl from 'fflate'

import { browser } from '$app/environment'

let toB64 = x => btoa(x).replace(/\+/g, '@').replace(/=+/, '')
let fromB64 = x => atob(x.replace(/@|-/g, '+').replace(/_/g, '/'))

export const compress = (a, f = () => {}) => {
  ffl.compress(ffl.strToU8(a), { level: 9, mem: 12 }, (err, data) => {
    if (err) {
      console.error(err)
      f('')
      return
    }
    if (browser) f('##' + toB64(ffl.strFromU8(data, true)))
  })
}

export const decompress = (a, f = () => {}) => {
  try {
    ffl.decompress(ffl.strToU8(fromB64(a.slice(2)), true), {}, (err, data) => {
      if (err) {
        console.error(err)
        f('')
        return
      }
      if (browser) f(ffl.strFromU8(data))
    })
  } catch (err) {
    console.error(err)
    f('')
  }
}
