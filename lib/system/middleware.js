/*
 * Middleware Composer Utility
 *
 * Overview:
 * This module is responsible for the dynamic composition of an Express-style middleware chain
 * for a given API route. It leverages a set of feature flags defined within the route configuration
 * object to selectively include and order necessary middleware components.
 *
 * Function Signature:
 * export default (route: RouteConfiguration): Array<MiddlewareFunction>
 *
 * Composition Logic:
 * The process first uses a declarative map (FLAG_TO_MIDDLEWARE) to handle simple boolean route.
 * It then applies specific conditional logic for special-case middleware (e.g., premium, requires, validator)
 * that require custom invocation or parameter handling.
 */

import restrict from '../../middlewares/restrict.js'
import authorization from '../../middlewares/authorization.js'
import rpm from '../../middlewares/rpm.js'
import protector from '../../middlewares/protector.js'
import premium from '../../middlewares/premium.js'
import requires from '../../middlewares/requires.js'
import error from '../../middlewares/error.js'

/**
 * Maps simple boolean flags in the route configuration to their corresponding middleware function.
 * Middleware with special logic (e.g., requiring parameters) are excluded from this map.
 */
const FLAG_TO_MIDDLEWARE = {
   restrict,
   authorize: authorization,
   protect: protector,
   rpm,
   error
}

export default route => {
   let middlewares = []

   /* Add standard middlewares using the FLAG_TO_MIDDLEWARE map */
   middlewares = Object.entries(FLAG_TO_MIDDLEWARE)
      .filter(([flagName]) => route[flagName])
      .map(([, middlewareFn]) => middlewareFn)

   /* Handle middleware with special execution logic */

   /* PREMIUM: Requires the entire route object */
   if (route.premium) {
      middlewares.push(premium(route))
   }

   /* REQUIRES: Use custom flag value or default requires(route) */
   if (route.requires) {
      middlewares.push(route.requires)
   } else {
      middlewares.push(requires(route))
   }

   /* VALIDATOR: Directly adds a custom validator middleware */
   if (route.validator) {
      middlewares.push(route.validator)
   }

   return middlewares
}