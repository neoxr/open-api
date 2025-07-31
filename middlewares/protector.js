import { allowedIPs } from '../lib/system/config.js'
import requestIp from 'request-ip'
import { CloudflareIPBlocker } from '../lib/cloudflare.js'
const blockedIps = new Map()

const blocker = new CloudflareIPBlocker(process.env.CF_API_TOKEN, process.env.CF_ZONE_ID)
const requestMap = {}

export default async (req, res, next) => {
   try {
      const userIP = requestIp.getClientIp(req)?.trim()

      if (!userIP) {
         console.warn('Could not determine client IP')
         return res.status(400).json({
            creator: global.creator,
            status: false,
            msg: 'Unable to determine client IP'
         })
      }

      if (blockedIps.has(userIP)) {
         return res.status(403).json({
            creator: global.creator,
            status: false,
            msg: 'IP is blocked'
         })
      }

      if (allowedIPs.includes(userIP)) {
         return next()
      }

      if (blocker.detectSpam(userIP, requestMap)) {
         console.log(`Spam detected from IP: ${userIP}`)
         blockedIps.set(userIP, true)
         await blocker.blockIP(userIP, 'Automatically blocked due to suspicious activity')

         return res.status(403).json({
            creator: global.creator,
            status: false,
            msg: 'Automatically blocked due to suspicious activity'
         })
      }

      return next()
   } catch (e) {
      console.error('Error occurred:', e)
      res.status(500).json({
         creator: global.creator,
         status: false,
         msg: 'Internal Server Error'
      })
   }
}