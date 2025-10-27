import restrict from '../../middlewares/restrict.js'
import authorization from '../../middlewares/authorization.js'
import rpm from '../../middlewares/rpm.js'
import protector from '../../middlewares/protector.js'
import premium from '../../middlewares/premium.js'
import requires from '../../middlewares/requires.js'
import error from '../../middlewares/error.js'

const FLAG_TO_MIDDLEWARE = {
   restrict,
   authorize: authorization,
   protect: protector,
   rpm,
   error
}

export default route => {
   let middlewares = []

   middlewares = Object.entries(FLAG_TO_MIDDLEWARE)
      .filter(([flagName]) => route[flagName])
      .map(([, middlewareFn]) => middlewareFn)

   if (route.premium) {
      middlewares.push(premium(route))
   }

   if (route.requires) {
      middlewares.push(route.requires)
   } else {
      middlewares.push(requires(route))
   }

   if (route.validator) {
      middlewares.push(route.validator)
   }

   return middlewares
}