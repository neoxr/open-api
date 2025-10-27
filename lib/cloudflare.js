import axios from 'axios'

export class CloudflareIPBlocker {
   constructor(apiToken, zoneId) {
      this.apiToken = apiToken
      this.zoneId = zoneId
      this.apiBase = `https://api.cloudflare.com/client/v4/zones/${zoneId}/firewall/access_rules/rules`
   }

   async blockIP(ip, note = 'Blocked due to spam') {
      try {
         const response = await axios.post(this.apiBase, {
            mode: 'block',
            configuration: {
               target: 'ip',
               value: ip
            },
            notes: note
         }, {
            headers: {
               Authorization: `Bearer ${this.apiToken}`,
               'Content-Type': 'application/json'
            }
         })

         if (!response.data.success) {
            console.error('Failed to block IP:', response.data.errors)
         } else {
            console.log(`Blocked IP: ${ip}`)
         }

         return response.data
      } catch (error) {
         if (error.response) {
            console.error('API error:', error.response.data)
         } else {
            console.error('Request error:', error.message)
         }
      }
   }

   detectSpam(ip, requestMap, threshold) {
      const now = Date.now()
      if (!requestMap[ip]) requestMap[ip] = []

      requestMap[ip].push(now)

      requestMap[ip] = requestMap[ip].filter(ts => now - ts < 60000)

      return requestMap[ip].length > (threshold || process.env.REQUEST_LIMIT)
   }
}
