import { getCloudflareEnv, jsonResponse } from './index.js'
import appConfig from './app-config.js'

export function defineApi(options) {
   const properties = options.properties || {}
   const execution = options.execution || options.handler

   return defineEventHandler(async (event) => {
      if (properties.error)
         return jsonResponse(event, {
            creator: appConfig.watermark.creator,
            status: false,
            msg: 'This endpoint is currently under maintenance.'
         }, 503)

      const method = getMethod(event)
      const query = getQuery(event) || {}

      let body = {}
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
         body = (await readBody(event).catch(() => ({}))) || {}
      }

      const params = { ...query, ...body }

      if (properties.premium) {
         const apiKeyHeader = getHeader(event, 'x-apikey')
         const userApiKey = params.apikey || apiKeyHeader

         const env = getCloudflareEnv(event) || {}
         const validApiKey = env.API_KEY || process.env.API_KEY || ''

         if (!userApiKey || userApiKey !== validApiKey)
            return jsonResponse(event, {
               creator: appConfig.watermark.creator,
               status: false,
               msg: 'Access denied. Provide a valid ?apikey= query parameter or x-apikey header.'
            }, 401)
      }

      if (properties.parameter && Array.isArray(properties.parameter) && properties.parameter.length > 0) {
         const missingParams = []

         for (const param of properties.parameter) {
            const val = params[param]
            if (val === undefined || val === null || String(val).trim() === '') {
               missingParams.push(param)
            }
         }

         if (missingParams.length > 0)
            return jsonResponse(event, {
               creator: appConfig.watermark.creator,
               status: false,
               msg: `Missing required parameter(s): ${missingParams.join(', ')}`
            }, 400)
      }

      return execution(event)
   })
}