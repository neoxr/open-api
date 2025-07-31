import axios from 'axios'

/**
 * A class to manage IP blocking on Cloudflare using the Firewall API.
 */
export class CloudflareIPBlocker {
   /**
    * Creates an instance of CloudflareIPBlocker.
    * @param {string} apiToken - The API token with permission to manage firewall rules.
    * @param {string} zoneId - The Cloudflare Zone ID where the firewall rules will be applied.
    */
   constructor(apiToken, zoneId) {
      this.apiToken = apiToken
      this.zoneId = zoneId
      this.apiBase = `https://api.cloudflare.com/client/v4/zones/${zoneId}/firewall/access_rules/rules`
   }

   /**
    * Blocks an IP address using Cloudflare's firewall API.
    * @param {string} ip - The IP address to be blocked.
    * @param {string} [note='Blocked due to spam'] - A note describing the reason for blocking.
    * @returns {Promise<Object>} The response data from the Cloudflare API.
    */
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

   /**
    * Detects potential spam activity based on the frequency of requests from a given IP address.
    * @param {string} ip - The IP address to monitor.
    * @param {Object} requestMap - A map storing timestamps of previous requests per IP.
    * @param {number} threshold - The maximum number of requests allowed within 1 minute.
    * @returns {boolean} True if the request count exceeds the threshold, indicating spam; otherwise, false.
    */
   detectSpam(ip, requestMap, threshold) {
      const now = Date.now()
      if (!requestMap[ip]) requestMap[ip] = []

      requestMap[ip].push(now)

      requestMap[ip] = requestMap[ip].filter(ts => now - ts < 60000)

      return requestMap[ip].length > (threshold || process.env.REQUEST_LIMIT)
   }
}
