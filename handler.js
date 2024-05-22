const { Loader, Scraper } = new(require('./lib'))
const express = require('express')
const router = express.Router()

const createRouter = async () => {
   try {
      await Loader.start()
      const routers = Object.values(Object.fromEntries(Object.entries(Loader.plugins)))
      routers.map(v => {
         const route = v.routes
         route.utils = { ...Scraper }
         const requires = (!route.requires ? (req, res, next) => {
            const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
            const check = global.status[reqFn](req, route.parameter)
            if (!check.status) return res.json(check)
            next()
         } : route.requires)
         router[route.method](route.path, requires, route.execution)
         if (router.stack.length === routers.length) return
      })
      return router
   } catch (e) {
      console.log(e)
   }
}

module.exports = createRouter()