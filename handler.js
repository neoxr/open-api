const Loader = new(require('./lib/system/loader'))
const express = require('express')
const router = express.Router()

const createRouter = async () => {
   try {
      await Loader.start()
      const routers = Object.fromEntries(Object.entries(Loader.plugins).filter(([name, _]) => !_.routes.error))
      for (const name in routers) {
         const route = routers[name].routes
         if (route.error) continue
         const validator = route.validator ? route.validator : (req, res, next) => {
            next()
         }
         router[route.method](route.path, validator, route.execution)
      }
      return router
   } catch (e) {
      console.log(e)
   }
}

module.exports = createRouter()