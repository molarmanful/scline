import { spawn } from 'child_process'
import { writeFile } from 'fs/promises'
import { PassThrough } from 'stream'

import stripAnsi from 'strip-ansi'
import { event } from 'sveltekit-sse'
import { file } from 'tmp-promise'

import { compress, decompress } from '$lib/ffl'

let MSG = (x, m) => JSON.stringify([x, m])
let CLOSE = MSG(-1, 0)
let delay = ms => new Promise(r => setTimeout(r, ms))

export const GET = async ({ params: { code } }) => {
  let { path, cleanup } = await file()
  await writeFile(path, await decompress(code))

  let std = new PassThrough()
  let run = spawn('sclin', ['-i', path])
  run.stdout.pipe(std)
  run.stderr.pipe(std)
  run.on('close', async () => {
    await cleanup()
  })

  return event(async emit => {
    let n = 0
    for await (let data of std) {
      data = stripAnsi(data + '')
      emit(MSG(n++, await compress(data)))
      n %= 9
    }
    emit(CLOSE)
  })
    .onCancel(() => {
      run.kill()
    })
    .toResponse()
}
