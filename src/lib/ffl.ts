import * as ffl from 'fflate'
import { base64ToUint8Array, uint8ArrayToBase64 } from 'uint8array-extras'

const promisify = <A, B, C>(
  f: (
    a: A,
    b: B,
    cb: (e: Error | null, x: C) => void
  ) => void,
) =>
  (...args: [A, B]) =>
    new Promise<C>((resolve, reject) => {
      f(...args, (err, res) => err ? reject(err) : resolve(res))
    })

const fpcomp = promisify<Uint8Array, ffl.AsyncGzipOptions, Uint8Array>(ffl.compress)
const fpdecomp = promisify<Uint8Array, ffl.AsyncGzipOptions, Uint8Array>(ffl.decompress)

export const toB64 = (x: Uint8Array) =>
  uint8ArrayToBase64(x).replaceAll('+', '.').replaceAll('/', '_').replaceAll('=+', '')

export const fromB64 = (x: string) =>
  base64ToUint8Array(x.replaceAll('.', '+').replaceAll('_', '/'))

export const compress = async (a: string) =>
  toB64(await fpcomp(ffl.strToU8(a), { level: 9, mem: 12 }))

export const decompress = async (a: string) =>
  ffl.strFromU8(await fpdecomp(fromB64(a), {}))

export const perm = async (a: string[], h = '#') => {
  const xs = await Promise.all(a.map(async x => x && (await compress(x))))
  return h + xs.join(h)
}

export const unperm = async (a: string, h = '#') =>
  await Promise.all(a.split(h).slice(1).map(decompress))
