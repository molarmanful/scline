import { spawn } from 'node:child_process'
import { PassThrough } from 'node:stream'

import posix from 'posix'
import { event } from 'sveltekit-sse'
import { compress, unperm } from '$lib/ffl'

const MSG = (x, m) => JSON.stringify([x, m])
const CLOSE = MSG(-1, 0)

const MAX_LEN = 128000

export const GET = async ({ params: { code } }) => {
  let [h, c, i] = await unperm(code, '~')
  if (h)
    c = `${h}\n${c}`
  const std = new PassThrough()
  const { uid, gid } = posix.getpwnam('jail')
  const run = spawn('sclin', ['--nocolor', '-i', '-e', c], {
    uid,
    gid,
    cwd: '/jail',
  })
  run.stdin.write(i || '\n')
  run.stdin.end()
  run.stdout.pipe(std)
  run.stderr.pipe(std)

  return event(async (emit) => {
    let n = 0
    const ec = async (m) => {
      m = await compress(m)
      await emit(MSG(n++, m))
    }

    await ec('[scline: running...]\n===>\n\n')
    let len = 0
    let plen = 0
    for await (const data of std) {
      plen = len
      len += data.length
      if (len >= MAX_LEN) {
        await ec(
          `${data.slice(0, MAX_LEN - plen)}...\n[scline: output truncated]`,
        )
        break
      }
      await ec(`${data}`)
      n %= 9
    }
    await ec('\n>===\n[scline: end]')
    await emit(CLOSE)
  })
    .onCancel(() => {
      run.kill()
    })
    .toResponse()
}
