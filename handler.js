const { Loader, Function: Func } = new(require('./lib'))
const { collection } = require('./lib/system/config')
const path = require('path')
const express = require('express')
const router = express.Router()

const createRouter = async () => {
   try {
      await Loader.router(path.join(__dirname, 'routers'))
      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))
      routers.some(v => {
         const route = v.routes
         if (route.name) collection.push({
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

         // error
         const error = (route.error ? (req, res, next) => {
            res.json({
               creator: global.creator,
               status: false,
               msg: `Sorry, this feature is currently error and will be fixed soon`
            })
         } : (req, res, next) => {
            next()
         })
         
         // vaidator & requires
         const requires = (!route.requires ? (req, res, next) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.status[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            const reqType = route.method === 'get' ? 'query': 'body'
            if ('url' in req[reqType]) {
               const isUrl = global.status.url(req[reqType].url)
               if (!isUrl.status) return res.json(isUrl)
               next()
            } else next()
         }: route.requires)

         // custom validator
         const validator = (route.validator ? route.validator: (req, res, next) => {
            next()
         })
         
         router[route.method](route.path, error, requires, validator, route.execution)
         if (router.stack.length === routers.length || (router.stack.length - 1) === routers.length) return
      })
      return router
   } catch (e) {
      console.log(e)
   }
}

module.exports = createRouter()