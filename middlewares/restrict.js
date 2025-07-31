import requestIp from 'request-ip'
import { allowedIPs } from '../lib/system/config.js'

export default (req, res, next) => {
   const userIP = requestIp.getClientIp(req)
   if (!allowedIPs.includes(userIP)) {
      return res.status(403).json({
         creator: global.creator,
         status: false,
         msg: 'Your IP is not allowed'
      })
   }
   next()
}