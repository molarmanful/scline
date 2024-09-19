import type { RequestHandler } from './$types'

import { spawn } from 'node:child_process'
import { PassThrough } from 'node:stream'

import { compress, unperm } from '$lib/ffl'
import posix from 'posix'
import { produce } from 'sveltekit-sse'

const MSG = (x: number, m: string) => JSON.stringify([x, m])
const CLOSE = MSG(-1, '')

const MAX_LEN = 128000

export const POST: RequestHandler = async ({ request }) => {
  const code = await request.text()
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

  return produce(async ({ emit }) => {
    let n = 0

    const ec = async (m: string) => {
      m = await compress(m)
      emit('msg', MSG(n++, m))
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
    emit('msg', CLOSE)

    return () => {
      run.kill()
    }
  })
}
