import { Loader, Function as Func } from './lib'
import { collection } from './lib/system/config'
import path, { dirname } from 'path'
import express, { Router, Request, Response, NextFunction } from 'express'
import { fileURLToPath } from 'url'

const router: Router = express.Router()

const createRouter = async (): Promise<Router> => {
   try {
      await Loader.router(path.join(__dirname, 'routers'))

      const routers: any[] = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))

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

         const error: (req: Request, res: Response, next: NextFunction) => void = route.error
            ? (req, res, next) => {
               res.json({
                  creator: global.creator,
                  status: false,
                  msg: `Sorry, this feature is currently error and will be fixed soon`
               })
            }
            : (req, res, next) => next()

         const requires: (req: Request, res: Response, next: NextFunction) => void = !route.requires
            ? (req, res, next) => {
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
            : route.requires

         const validator: (req: Request, res: Response, next: NextFunction) => void = route.validator
            ? route.validator
            : (req, res, next) => next()

         router[route.method](route.path, error, requires, validator, route.execution)

         if (router.stack.length === routers.length || (router.stack.length - 1) === routers.length) return
      })

      return router
   } catch (e) {
      console.log(e)
      throw new Error('Error while creating router')
   }
}

export default createRouter()