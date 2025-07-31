import requestIp from 'request-ip'

const ipRequests = new Map()

export default (req, res, next) => {
   const userIP = requestIp.getClientIp(req)
   const currentTime = Date.now()

   if (!ipRequests.has(userIP)) ipRequests.set(userIP, [])

   const filtered = ipRequests.get(userIP).filter(t => currentTime - t < 60000)

   if (filtered.length >= process.env.REQUEST_LIMIT) {
      return res.status(429).json({
         creator: global.creator,
         status: false,
         msg: 'Too many requests'
      })
   }

   filtered.push(currentTime)
   ipRequests.set(userIP, filtered)
   next()
}