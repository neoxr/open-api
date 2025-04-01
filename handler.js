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
const requestLimit = process.env.REQUEST_LIMIT
const ipRequests = new Map()

const createRouter = async () => {
   try {
      await Loader.router(path.join(__dirname, 'routers'))
      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))

      for (const v of routers) {
         const route = v.routes
         if (route.name) {
            collection.push({
               category: Func.ucword(route.category),
               base_code: Buffer.from(route.category.toLowerCase()).toString('base64'),
               name: route.name,
               path: route.example ? `${route.path}?${new URLSearchParams(route.example).toString('utf-8')}` : route.path,
               method: route.method.toUpperCase(),
               raw: { path: route.path, example: route.example || null },
               error: route.error,
               premium: route.premium
            })
         }

         const restrict = route.restrict ? (req, res, next) => {
            const userIP = requestIp.getClientIp(req)
            if (!allowedIPs.includes(userIP)) {
               return res.status(403).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Your IP is not allowed'
               })
            }
            next()
         } : (req, res, next) => next()

         const authorize = route.authorize ? (req, res, next) => {
            const authHeader = req.headers['authorization']
            const authToken = authHeader?.split(' ')[1]?.trim()
            if (!authToken || !req.session?.token || authToken !== req.session.token) {
               console.warn(`[WARN] Unauthorized request from ${requestIp.getClientIp(req)}`)
               return res.status(401).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Unauthorized'
               })
            }
            jwt.verify(authToken, process.env.JWT_SECRET, (err) => {
               if (err) {
                  console.warn(`[WARN] Forbidden request from ${requestIp.getClientIp(req)}`)
                  return res.status(403).json({
                     creator: global.creator,
                     status: false,
                     msg: 'Forbidden access'
                  })
               }
               next()
            })
         } : (req, res, next) => next()

         const rpm = route.rpm ? (req, res, next) => {
            const userIP = requestIp.getClientIp(req)
            const currentTime = Date.now()
            if (!ipRequests.has(userIP)) {
               ipRequests.set(userIP, [])
            }
            const requests = ipRequests.get(userIP).filter(time => currentTime - time < 60000)
            if (requests.length >= requestLimit) {
               return res.status(429).json({
                  creator: global.creator,
                  status: false,
                  msg: 'Too many requests'
               })
            }
            requests.push(currentTime)
            ipRequests.set(userIP, requests)
            next()
         } : (req, res, next) => next()

         const error = route.error ? (req, res, next) => {
            return res.json({
               creator: global.creator,
               status: false,
               msg: 'Feature is currently unavailable'
            })
         } : (req, res, next) => next()

         const requires = !route.requires ? (req, res, next) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.status[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            const reqType = route.method === 'get' ? 'query' : 'body'
            if ('url' in req[reqType]) {
               const isUrl = global.status.url(req[reqType].url)
               if (!isUrl.status) return res.json(isUrl)
            }
            next()
         } : route.requires

         const validator = route.validator || ((req, res, next) => next())

         if (!router.stack.some(layer => layer.route && layer.route.path === route.path && Object.keys(layer.route.methods).includes(route.method))) {
            router[route.method](route.path, restrict, authorize, rpm, error, requires, validator, route.execution)
         }
      }

      return router
   } catch (e) {
      console.error('[ERROR] Router creation failed:', e)
   }
}

export { createRouter }