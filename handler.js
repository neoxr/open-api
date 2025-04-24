import { Loader, Func } from './lib/index.js'
import { collection } from './lib/system/config.js'
import middleware from './lib/system/middleware.js'

import path, { dirname } from 'path'
import express from 'express'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
         
         router[route.method](route.path, ...middleware(route), route.execution)
      }

      return router
   } catch (e) {
      console.error('[ERROR] Router creation failed:', e)
   }
}

export { createRouter }