import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'
import { allowedIPs } from './config.js'

const requestLimit = process.env.REQUEST_LIMIT
const ipRequests = new Map()

/**
 * Generates middleware functions based on route configuration.
 * @param {Object} route - The route object containing middleware rules.
 * @returns {Function[]} - An array of middleware functions.
 */
export default route => {
   const middlewares = []

   /**
    * Restricts access based on allowed IPs.
    * Middleware applied when `route.restrict` is set.
    */
   if (route.restrict) {
      middlewares.push((req, res, next) => {
         const userIP = requestIp.getClientIp(req)
         if (!allowedIPs.includes(userIP)) {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Your IP is not allowed'
            })
         }
         next()
      })
   }

   /**
    * Authorizes user based on JWT.
    * Middleware applied when `route.authorize` is set.
    */
   if (route.authorize) {
      middlewares.push((req, res, next) => {
         const authHeader = req.headers['authorization']
         const authToken = authHeader?.split(' ')[1]?.trim()

         if (!authToken || authToken !== req.session?.token) {
            return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'Unauthorized'
            })
         }

         jwt.verify(authToken, process.env.JWT_SECRET, (err) => {
            if (err) {
               return res.status(403).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Forbidden access'
               })
            }
            next()
         })
      })
   }

   /**
    * Limits requests per minute based on IP.
    * Middleware applied when `route.rpm` is set.
    */
   if (route.rpm) {
      middlewares.push((req, res, next) => {
         const userIP = requestIp.getClientIp(req)
         const currentTime = Date.now()

         if (!ipRequests.has(userIP)) ipRequests.set(userIP, [])

         const filtered = ipRequests.get(userIP).filter(t => currentTime - t < 60000)

         if (filtered.length >= requestLimit) {
            return res.status(429).json({
               creator: global.creator,
               status: false,
               msg: 'Too many requests'
            })
         }

         filtered.push(currentTime)
         ipRequests.set(userIP, filtered)
         next()
      })
   }

   /**
    * Handles unavailable features by returning an error response.
    * Middleware applied when `route.error` is set.
    */
   if (route.error) {
      middlewares.push((req, res) => {
         res.json({
            creator: global.creator,
            status: false,
            msg: 'Feature is currently unavailable'
         })
      })
   }

   /**
    * Validates request parameters.
    * Middleware applied unless `route.requires` is set.
    */
   if (!route.requires) {
      middlewares.push((req, res, next) => {
         const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
         const check = global.status[reqFn](req, route.parameter)

         if (!check.status) return res.json(check)

         const reqType = route.method === 'get' ? 'query' : 'body'
         if ('url' in req[reqType]) {
            const isUrl = global.status.url(req[reqType].url)
            if (!isUrl.status) return res.json(isUrl)
         }

         next()
      })
   } else {
      middlewares.push(route.requires)
   }

   /**
    * Applies additional validation rules if `route.validator` is set.
    */
   if (route.validator) {
      middlewares.push(route.validator)
   }

   return middlewares
}
