import { Application, Request, Response, NextFunction } from 'express'
import Func from './functions'
import { collection } from './config'
import fs from 'fs'
import path from 'path'
import middleware from './middleware'
import { Route, Method } from './types'

class RouteLoader {
   private app: Application
   private routeFiles: string[]

   constructor(app: Application) {
      this.app = app
      this.routeFiles = []
   }

   getRouteFiles(dir: string): string[] {
      const files = fs.readdirSync(dir, { withFileTypes: true })
      let routeFiles: string[] = []

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

   load(dir: string): void {
      this.routeFiles = this.getRouteFiles(dir)

      for (const filePath of this.routeFiles) {
         try {
            const routeModule = require(filePath)
            const routes = routeModule.routes || routeModule.default

            if (Array.isArray(routes)) {
               routes.forEach((route: Route) => this.defineRoute(route))
            } else if (routes && typeof routes === 'object') {
               this.defineRoute(routes as Route)
            } else {
               console.error(`Invalid route format in ${filePath}`)
            }
         } catch (err) {
            console.error(`Failed to load routes from ${filePath}`, err)
         }
      }
   }

   defineRoute(route: Route): void {
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
            method: method.toUpperCase() as Method,
            raw: { path: routePath, example: route.example || null },
            error: route.error,
            premium: route.premium
         })
      }

      this.app[method](routePath, ...middleware(route), async (req: Request, res: Response, next: NextFunction) => {
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

export default RouteLoader