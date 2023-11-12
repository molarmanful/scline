import { error } from '@sveltejs/kit'
import { RateLimiter } from 'sveltekit-rate-limiter/server'

let lim = new RateLimiter({ rates: { IPUA: [10, 'm'] } })

export const actions = {
  default: async event => {
    if (await lim.isLimited(event)) throw error(429)
  },
}
