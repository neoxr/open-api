const { Loader, Function: Func, Scraper } = new(require('./lib'))
const { collection } = require('./lib/system/config')
const NeoxrApi = (new(require('@neoxr/api'))(null, process.env.API_KEY))
const express = require('express')
const router = express.Router()

const createRouter = async () => {
   try {
      await Loader.router('./routers')
      await Loader.scraper('./lib/scraper')
      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))
      routers.map(v => {
         const route = v.routes
         if (route.name) collection.push({
            base_code: Buffer.from(route.category.toLowerCase()).toString('base64'),
            name: route.name,
            path: route.example ? `${route.path}?${new URLSearchParams(route.example).toString('utf-8')}${route.premium ? '&apikey=' + ('Y') : ''}` : '',
            method: route.method.toUpperCase(),
            error: route.error
         })
   
         route.utils = Object.freeze({
            Scraper: {
               ...Scraper,
               ...Loader.scrapers,
            },
            Api: NeoxrApi,
            Func
         })
         
         // vaidator & requires
         const requires = (!route.requires ? (req, res, next) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.status[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            if ('url' in req.query) {
               const isUrl = global.status.url(req.query.url)
               if (!isUrl.status) return res.json(isUrl)
               next()
            } else next()
         }: route.requires)

         // custom validator
         const validator = (route.validator ? route.validator: (req, res, next) => {
            next()
         })
         
         // compile router
         router[route.method](route.path, requires, validator, route.execution)
         if (router.stack.length === routers.length) return
      })
      
      return router
   } catch (e) {
      console.log(e)
   }
}

module.exports = createRouter()