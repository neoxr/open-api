import { Loader, Function as Func } from './lib'
import { collection } from './lib/system/config'
import path from 'path'
import express, { Router, Request, Response, NextFunction } from 'express'
const router: Router = express.Router()

const createRouter = async (): Promise<Router | undefined> => {
   try {
      await Loader.router(path.join(__dirname, 'routers'))

      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))
      console.log(routers)
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
         const error = (route.error
            ? (req: Request, res: Response, next: NextFunction) => {
               res.json({
                  creator: global.creator,
                  status: false,
                  msg: `Sorry, this feature is currently error and will be fixed soon`
               })
            }
            : (req: Request, res: Response, next: NextFunction) => {
               next()
            })

         // validator & requires
         const requires = (!route.requires
            ? (req: Request, res: Response, next: NextFunction) => {
               const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
               const check = global.appStatus[reqFn](req, route.parameter)
               if (!check.status) return res.json(check)
               const reqType = route.method === 'get' ? 'query' : 'body'
               if ('url' in req[reqType]) {
                  const isUrl = global.appStatus.url(req[reqType].url)
                  if (!isUrl.status) return res.json(isUrl)
                  next()
               } else next()
            }
            : route.requires)

         // custom validator
         const validator = (route.validator
            ? route.validator
            : (req: Request, res: Response, next: NextFunction) => {
               next()
            })

         // Add route handler to the router
         router[route.method](route.path, error, requires, validator, route.execution)

         if (router.stack.length === routers.length || (router.stack.length - 1) === routers.length) return
      })

      return router
   } catch (e) {
      console.log(e)
   }
}

export { createRouter }