import { spawn } from 'child_process'
import { PassThrough } from 'stream'

import { event } from 'sveltekit-sse'

import { compress, decompress } from '$lib/ffl'

let MSG = (x, m) => JSON.stringify([x, m])
let CLOSE = MSG(-1, 0)
let delay = ms => new Promise(r => setTimeout(r, ms))

export const GET = async ({ params: { code } }) => {
  code = await decompress(code)
  let std = new PassThrough()
  let run = spawn('sclin', ['--nocolor', '-i', '-e', code])
  run.stdout.pipe(std)
  run.stderr.pipe(std)

  return event(async emit => {
    let n = 0
    let ec = async m => {
      m = await compress(m)
      await emit(MSG(n++, m))
    }

    await ec('[scline: running...]\n===>\n\n')
    let len = 0
    for await (let data of std) {
      len += data.length
      await ec(data + '')
      n %= 9
      if (len > 128000) {
        await ec('...\n[scline: output truncated]')
        break
      }
    }
    await ec('\n>===\n[scline: end]')
    await emit(CLOSE)
  })
    .onCancel(() => {
      run.kill()
    })
    .toResponse()
}
