import { Loader, Function as Func } from './lib'
import { allowedIPs, collection } from './lib/Utils/config'
import path from 'path'
import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'
import express, { Router, Request, Response, NextFunction } from 'express'
const router: Router = express.Router()

// Limiting RPM (Requests Per Minute) per IP
const requestLimit = 60 // Maximum 60 requests per IP in 1 minute
const ipRequests = {} // Storage for IP and requests made

const createRouter = async (): Promise<Router | undefined> => {
   try {
      await Loader.router(path.join(__dirname, 'routers'))

      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))
      routers.some((v: any) => {
         const route = v.routes
         if (route.name) {
            collection.push({
               category: Func.ucword(route.category),
               base_code: Buffer.from(route.category.toLowerCase()).toString('base64'),
               name: route.name,
               path: route.example ? `${route.path}?${new URLSearchParams(route.example).toString()}` : route.path,
               method: route.method.toUpperCase(),
               raw: {
                  path: route.path,
                  example: route.example || null
               },
               error: route.error,
               premium: route.premium
            })
         }

         // error
         const error = (route.error ? (req: Request, res: Response, next: NextFunction) => {
            res.json({
               creator: global.creator,
               status: false,
               msg: `Sorry, this feature is currently error and will be fixed soon`
            })
         } : (req: Request, res: Response, next: NextFunction) => {
            next()
         })

         // Middleware to restrict access based on IP
         const restrict = route.restrict ? (req: Request, res: Response, next: NextFunction) => {
            const userIP = requestIp.getClientIp(req)
            if (!allowedIPs.includes(userIP)) return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Your IP is not allowed to access this page'
            })
            next()
         } : (req: Request, res: Response, next: NextFunction) => {
            next()
         }

         // Middleware to JWT authentication
         const authorize = (route.authorize ? (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers['authorization']
            const authToken = authHeader && authHeader.split(' ')[1].trim()
            if (!authToken || authToken != req.session.token) return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'Unauthorized'
            })
            jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
               if (err) return res.status(403).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Forbidden access'
               })
               next()
            })
         } : (req: Request, res: Response, next: NextFunction) => {
            next()
         })

         // Middleware to check request limit per IP
         const rpm = route.rpm ? (req: Request, res: Response, next: NextFunction) => {
            const userIP = requestIp.getClientIp(req)
            const currentTime = Date.now()

            if (!ipRequests[userIP]) {
               ipRequests[userIP] = []
            }

            ipRequests[userIP] = ipRequests[userIP].filter(timestamp => currentTime - timestamp < 60000)

            if (ipRequests[userIP].length >= requestLimit) {
               return res.status(429).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Too many requests. Please try again later.'
               })
            }

            ipRequests[userIP].push(currentTime)

            next()
         } : (req: Request, res: Response, next: NextFunction) => {
            next()
         }

         // validator & requires
         const requires = (!route.requires ? (req: Request, res: Response, next: NextFunction) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.appStatus[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            const reqType = route.method === 'get' ? 'query' : 'body'
            if ('url' in req[reqType]) {
               const isUrl = global.appStatus.url(req[reqType].url)
               if (!isUrl.status) return res.json(isUrl)
               next()
            } else next()
         } : route.requires)

         // custom validator
         const validator = (route.validator ? route.validator : (req: Request, res: Response, next: NextFunction) => {
            next()
         })

         // Add route handler to the router
         router[route.method](route.path, error, restrict, authorize, rpm, requires, validator, route.execution)

         if (router.stack.length === routers.length || (router.stack.length - 1) === routers.length) return
      })

      return router
   } catch (e) {
      console.error(e)
   }
}

export { createRouter }