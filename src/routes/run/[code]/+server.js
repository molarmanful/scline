import { spawn } from 'child_process'
import { PassThrough } from 'stream'

import stripAnsi from 'strip-ansi'
import { event } from 'sveltekit-sse'

import { compress, decompress } from '$lib/ffl'

let MSG = (x, m) => JSON.stringify([x, m])
let CLOSE = MSG(-1, 0)
let delay = ms => new Promise(r => setTimeout(r, ms))

export const GET = async ({ params: { code } }) => {
  let std = new PassThrough()
  let run = spawn('sclin', ['-e', await decompress(code)])
  run.stdout.pipe(std)
  run.stderr.pipe(std)

  return event(async emit => {
    let n = 0
    let ec = async m => emit(MSG(n++, await compress(m)))

    await ec('==>\n')
    for await (let data of std) {
      data = stripAnsi(data + '')
      await ec(data)
      n %= 9
    }
    emit(CLOSE)
  })
    .onCancel(() => {
      run.kill()
    })
    .toResponse()
}
