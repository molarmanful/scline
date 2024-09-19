import { error, type RequestEvent } from '@sveltejs/kit'
import { RateLimiter } from 'sveltekit-rate-limiter/server'

const lim = new RateLimiter({ rates: { IPUA: [10, 'm'] } })

export const actions = {
  default: async (event: RequestEvent) => {
    if (await lim.isLimited(event))
      error(429)
  },
}
