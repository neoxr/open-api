import { Func } from '../index.js'
import { collection } from './config.js'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import middleware from './middleware.js'

class RouteLoader {
   /**
    * Constructor for the RouteLoader class
    * @param {Object} app - Express application instance
    */
   constructor(app) {
      this.app = app
      this.routeFiles = []
   }

   /**
    * Recursively finds all `.js` files in the given directory
    * @param {string} dir - Directory to scan
    * @returns {string[]} - List of file paths found
    */
   getRouteFiles(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true })
      let routeFiles = []

      for (const file of files) {
         const fullPath = path.join(dir, file.name)
         if (file.isDirectory()) {
            routeFiles = routeFiles.concat(this.getRouteFiles(fullPath))
         } else if (file.isFile() && file.name.endsWith('.js')) {
            routeFiles.push(fullPath)
         }
      }

      return routeFiles
   }

   /**
    * Loads all route files and defines them in the Express application
    * @param {string} dir - Router directory
    * @async
    */
   async load(dir) {
      this.routeFiles = this.getRouteFiles(dir)

      for (const filePath of this.routeFiles) {
         try {
            const routeModule = await import(pathToFileURL(filePath).href)
            const routes = routeModule.routes || routeModule.default

            if (Array.isArray(routes)) {
               routes.forEach(route => this.defineRoute(route))
            } else if (routes && typeof routes === 'object') {
               this.defineRoute(routes)
            } else {
               console.error(`Invalid route format in ${filePath}`)
            }
         } catch (err) {
            console.error(`Failed to import routes from ${filePath}`, err)
         }
      }
   }

   /**
    * Defines a route in the Express application
    * @param {Object} route - Route object with required properties
    */
   defineRoute(route) {
      const { category, path, method, execution, error } = route

      if (!path || !method || typeof execution !== 'function') {
         console.error('Route missing required properties:', route)
         return
      }

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

      const routeSpecificMiddleware = route.middleware || []

      this.app[method](path, ...middleware(route), ...routeSpecificMiddleware, async (req, res, next) => {
         try {
            await execution(req, res, next)
         } catch (err) {
            if (res.headersSent) {
               return next(err)
            }

            if (error) {
               console.error('Error occurred:', err)
               res.status(500).json({
                  status: false,
                  msg: 'Internal Server Error',
                  error: process.env.NODE_ENV === 'development' ? String(err) : undefined
               })
            } else {
               next(err)
            }
         }
      })
   }
}

export default RouteLoader