import path from 'node:path'
import fs from 'node:fs'

import { capitalize } from './server/utils/index.js'

export function getApiEndpoints() {
   const apiDir = path.resolve('./server/api')
   if (!fs.existsSync(apiDir)) return { endpoints: [], endpointsMap: {} }

   const endpoints = []
   const endpointsMap = {}

   function scanDir(dir) {
      const files = fs.readdirSync(dir)
      for (const file of files) {
         const fullPath = path.join(dir, file)
         const stat = fs.statSync(fullPath)

         if (stat.isDirectory()) {
            scanDir(fullPath)
         } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            if (file.includes('endpoints')) continue

            const relativePath = path.relative(apiDir, fullPath).replace(/\\/g, '/')
            const content = fs.readFileSync(fullPath, 'utf-8')

            const nameMatch = content.match(/name\s*:\s*['"`](.*?)['"`]/)
            if (!nameMatch || !nameMatch[1]) continue

            const categoryMatch = content.match(/category\s*:\s*['"`](.*?)['"`]/)
            const descMatch = content.match(/description\s*:\s*['"`](.*?)['"`]/)
            const premiumMatch = content.match(/premium\s*:\s*(true|false)/i)
            const errorMatch = content.match(/error\s*:\s*(true|false)/i)
            const paramMatch = content.match(/parameter\s*:\s*\[(.*?)\]/s)

            let parameterList = []
            if (paramMatch && paramMatch[1]) {
               parameterList = paramMatch[1]
                  .split(',')
                  .map(s => s.replace(/['"`\s]/g, ''))
                  .filter(Boolean)
            }

            const methodMatch = file.match(/\.(get|post|put|delete|patch)\.(js|ts)$/)
            const method = methodMatch ? methodMatch[1].toUpperCase() : 'ALL'

            const cleanPath = ('/api/' + relativePath
               .replace(/\.(get|post|put|delete|patch)\.(js|ts)$/, '')
               .replace(/\.(js|ts)$/, '')
            ).toLowerCase().replace(/\/$/, '')

            const segments = relativePath.split('/')
            const defaultCategory = segments.length > 1 ? capitalize(segments[0]) : 'General'

            const endpointData = {
               path: cleanPath,
               method: method,
               name: nameMatch[1],
               category: categoryMatch ? categoryMatch[1] : defaultCategory,
               description: descMatch ? descMatch[1] : '',
               premium: premiumMatch ? premiumMatch[1].toLowerCase() === 'true' : false,
               error: errorMatch ? errorMatch[1].toLowerCase() === 'true' : false,
               parameter: parameterList
            }

            endpoints.push(endpointData)
            endpointsMap[cleanPath] = endpointData
         }
      }
   }

   scanDir(apiDir)
   return { endpoints, endpointsMap }
}