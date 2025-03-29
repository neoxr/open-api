import { Loader, Func } from './lib/index.js'
import { allowedIPs, collection } from './lib/system/config.js'
import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'
import path, { dirname } from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Limiting RPM (Requests Per Minute) per IP
const requestLimit = 60 // Maximum 60 requests per IP in 1 minute
const ipRequests = {} // Storage for IP and requests made

const createRouter = async () => {
   try {
      // Load all routers from the "routers" directory
      await Loader.router(path.join(__dirname, 'routers'))

      // Retrieve the list of registered plugins in Loader
      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))

      // Iterate through each plugin to register routes
      routers.some(v => {
         const route = v.routes

         // Add route information to the collection if it has a "name" property
         if (route.name) {
            collection.push({
               category: Func.ucword(route.category),
               base_code: Buffer.from(route.category.toLowerCase()).toString('base64'),
               name: route.name,
               path: route.example ? `${route.path}?${new URLSearchParams(route.example).toString('utf-8')}` : route.path,
               method: route.method.toUpperCase(),
               raw: {
                  path: route.path,
                  example: route.example || null
               },
               error: route.error,
               premium: route.premium
            })
         }

         // Middleware to restrict access based on IP
         const restrict = route.restrict ? (req, res, next) => {
            const userIP = requestIp.getClientIp(req)
            if (!allowedIPs.includes(userIP)) {
               return res.status(403).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Your IP is not allowed to access this page'
               })
            }
            next()
         } : (req, res, next) => next()

         // Middleware to JWT authentication
         const authorize = (route.authorize ? (req, res, next) => {
            const authHeader = req.headers['authorization']
            const authToken = authHeader && authHeader.split(' ')[1].trim()
            if (!authToken || authToken != req.session.token) {
               return res.status(401).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Unauthorized'
               })
            }

            jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
               if (err) {
                  return res.status(403).json({
                     creator: global.creator,
                     status: false,
                     msg: 'Forbidden access'
                  })
               }
               next()
            })
         } : (req, res, next) => next())

         // Middleware to check request limit per IP
         const rpm = route.rpm ? (req, res, next) => {
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
         } : (req, res, next) => next()

         // Middleware to handle routes with error status
         const error = route.error ? (req, res, next) => {
            return res.json({
               creator: global.creator,
               status: false,
               msg: `Sorry, this feature is currently error and will be fixed soon`
            })
         } : (req, res, next) => next()

         // Middleware to validate route parameters
         const requires = !route.requires ? (req, res, next) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.status[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            const reqType = route.method === 'get' ? 'query' : 'body'
            if ('url' in req[reqType]) {
               const isUrl = global.status.url(req[reqType].url)
               if (!isUrl.status) return res.json(isUrl)
               next()
            } else next()
         } : route.requires

         // Additional custom middleware (if provided)
         const validator = route.validator ? route.validator : (req, res, next) => next()

         // Register the route on the router
         if (!router.stack.some(layer => layer.route && layer.route.path === route.path)) {
            // Suggested code may be subject to a license. Learn more: ~LicenseLog:3148310086.
            router[route.method](route.path, restrict, authorize, rpm, error, requires, validator, route.execution)
         }
      })

      return router
   } catch (e) {
      console.log(e)
   }
}

// Export createRouter function as default
export default createRouter()