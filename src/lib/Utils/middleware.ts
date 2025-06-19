import { allowedIPs } from './config'
import requestIp from 'request-ip'
import { Request, Response, NextFunction } from 'express'
import { Method, Minddleware } from './types'

const requestLimit = Number(process.env.REQUEST_LIMIT || 100)
const ipRequests: Record<string, number[]> = {}

export default (route: Minddleware) => {
   const middlewares: Array<(req: Request, res: Response, next: NextFunction) => void> = []

   // Restrict IP
   if (route.restrict) {
      middlewares.push((req, res, next) => {
         const userIP = requestIp.getClientIp(req) || ''
         if (!allowedIPs.includes(userIP)) {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Your IP is not allowed to access this page'
            })
         }
         next()
      })
   }

   // Rate Limit per Minute
   if (route.rpm) {
      middlewares.push((req, res, next) => {
         const userIP = requestIp.getClientIp(req) || ''
         const currentTime = Date.now()

         if (!ipRequests[userIP]) {
            ipRequests[userIP] = []
         }

         ipRequests[userIP] = ipRequests[userIP].filter(ts => currentTime - ts < 60000)

         if (ipRequests[userIP].length >= requestLimit) {
            return res.status(429).json({
               creator: global.creator,
               status: false,
               msg: 'Too many requests. Please try again later.'
            })
         }

         ipRequests[userIP].push(currentTime)
         next()
      })
   }

   // Error Middleware
   if (route.error) {
      middlewares.push((req, res) => {
         return res.json({
            creator: global.creator,
            status: false,
            msg: 'Sorry, this feature is currently error and will be fixed soon'
         })
      })
   }

   // Parameter Validation
   if (!route.requires) {
      middlewares.push((req, res, next) => {
         const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
         const check = global.appStatus[reqFn](req, route.parameter ?? [])
         if (!check.status) return res.status(400).json(check)

         const reqType = route.method === 'get' ? 'query' : 'body'
         if ('url' in req[reqType]) {
            const isUrl = global.appStatus.url(req[reqType].url)
            if (!isUrl.status) return res.status(400).json(isUrl)
         }

         next()
      })
   } else {
      middlewares.push(route.requires)
   }

   // Custom Validator (optional)
   middlewares.push(route.validator || ((req, _res, next) => next()))

   return middlewares
}