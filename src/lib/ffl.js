import * as ffl from 'fflate'
import { decode, encode } from 'uint8-to-base64'

let promisify =
  f =>
  (...args) =>
    new Promise((resolve, reject) => {
      f(...args, (err, res) => (err ? reject(err) : resolve(res)))
    })

let fpcomp = promisify(ffl.compress)
let fpdecomp = promisify(ffl.decompress)

export const toB64 = x =>
  encode(x).replace(/\+/g, '.').replace(/\//g, '_').replace(/=+/, '')

export const fromB64 = x => decode(x.replace(/\./g, '+').replace(/_/g, '/'))

export const compress = async a =>
  toB64(await fpcomp(ffl.strToU8(a), { level: 9, mem: 12 }))

export const decompress = async a =>
  ffl.strFromU8(await fpdecomp(fromB64(a), {}))

export const perm = async (a, h = '#') => {
  let xs = await Promise.all(a.map(async x => x && (await compress(x))))
  return h + xs.join(h)
}

export const unperm = async (a, h = '#') =>
  await Promise.all(a.split(h).slice(1).map(decompress))
