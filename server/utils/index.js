import { toWebRequest } from 'h3'

export function getWebRequest(event) {
   return event.web?.request || event.node?.req?.request || toWebRequest(event)
}

export function getCloudflareEnv(event) {
   return event.context?.cloudflare?.env || event.context?.env || globalThis.__env__ || {}
}

export function jsonResponse(event, data, statusCode = 200) {
   setResponseStatus(event, statusCode)
   setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
   return JSON.stringify(data, null, 2)
}

export function capitalize(str) {
   if (!str) return ''
   return str.charAt(0).toUpperCase() + str.slice(1)
}