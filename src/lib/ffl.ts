import { Buffer } from 'node:buffer'
import { promisify } from 'node:util'

import * as ffl from 'fflate'

const encode = (x: Uint8Array) => Buffer.from(x).toString('base64')

const decode = (x: string) => {
  const b = Buffer.from(x, 'base64')
  return new Uint8Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}

const fpcomp = promisify<Uint8Array, ffl.AsyncGzipOptions, Uint8Array>(ffl.compress)
const fpdecomp = promisify<Uint8Array, ffl.AsyncGzipOptions, Uint8Array>(ffl.decompress)

export const toB64 = (x: Uint8Array) =>
  encode(x).replace(/\+/g, '.').replace(/\//g, '_').replace(/=+/, '')

export const fromB64 = (x: string) =>
  decode(x.replace(/\./g, '+').replace(/_/g, '/'))

export const compress = async (a: string) =>
  toB64(await fpcomp(ffl.strToU8(a), { level: 9, mem: 12 }))

export const decompress = async (a: string) =>
  ffl.strFromU8(await fpdecomp(fromB64(a), {}))

export const perm = async (a: string[], h = '#') => {
  const xs = await Promise.all(
    a.map(async x =>
      x && (await compress(x)),
    ),
  )
  return h + xs.join(h)
}

export const unperm = async (a: string, h = '#') =>
  await Promise.all(a.split(h).slice(1).map(decompress))
