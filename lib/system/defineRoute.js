const Func = require('./functions')
const { collection } = require('./config')
const fs = require('fs')
const path = require('path')
const middleware = require('./middleware')

class RouteLoader {
   constructor(app) {
      this.app = app
      this.routeFiles = []
   }

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

   load(dir) {
      this.routeFiles = this.getRouteFiles(dir)

      for (const filePath of this.routeFiles) {
         try {
            const routeModule = require(filePath)
            const routes = routeModule.routes || routeModule.default

            if (Array.isArray(routes)) {
               routes.forEach(route => this.defineRoute(route))
            } else if (routes && typeof routes === 'object') {
               this.defineRoute(routes)
            } else {
               console.error(`Invalid route format in ${filePath}`)
            }
         } catch (err) {
            console.error(`Failed to load routes from ${filePath}`, err)
         }
      }
   }

   defineRoute(route) {
      const { category, path: routePath, method, execution, error } = route

      if (!routePath || !method || typeof execution !== 'function') {
         console.error('Route missing required properties:', route)
         return
      }

      if (route.name) {
         collection.push({
            category: Func.ucword(category),
            base_code: Buffer.from(category.toLowerCase()).toString('base64'),
            name: route.name,
            path: route.example
               ? `${routePath}?${new URLSearchParams(route.example).toString()}`
               : routePath,
            method: method.toUpperCase(),
            raw: { path: routePath, example: route.example || null },
            error: route.error,
            premium: route.premium
         })
      }

      this.app[method](routePath, ...middleware(route), async (req, res, next) => {
         try {
            await execution(req, res, next)
         } catch (err) {
            if (res.headersSent) return next(err)

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

module.exports = RouteLoader
