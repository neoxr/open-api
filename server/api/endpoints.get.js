import { jsonResponse } from '../utils/index.js'
import appConfig from '../utils/app-config.js'

export default defineEventHandler((event) => {
   const config = useRuntimeConfig(event)
   const endpoints = config.endpointsList || []

   return jsonResponse(event, {
      creator: appConfig.watermark.creator,
      status: true,
      data: {
         total: endpoints.length,
         endpoints: endpoints
      }
   })
})