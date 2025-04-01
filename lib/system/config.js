import requestIp from 'request-ip'
import NodeCache from '@cacheable/node-cache'

const cache = new NodeCache({
   stdTTL: process.env.CACHE_TTL,
   checkperiod: process.env.CACHE_PERIOD
})

// Define global status object for validation and error handling
global.creator = `@neoxr.js – Wildan Izzudin`
global.status = {
   /**
    * Validates the required GET query parameters in the request.
    * 
    * @param {object} req - The request object.
    * @param {Array<string>} params - Array of required query parameter keys.
    * @returns {object} - Returns status object indicating whether parameters are valid or not.
    */
   reqGet: (req, params = []) => {
      const missingParams = params.filter(key => !(key in req.query) || !req.query[key])
      if (missingParams.length > 0) {
         return {
            creator: global.creator,
            status: false,
            msg: `Parameter${missingParams.length > 1 ? 's' : ''} ${formatList(missingParams)} ${missingParams.length > 1 ? 'are' : 'is'} required`
         }
      }
      return { status: true }
   },

   /**
    * Validates the required POST body parameters in the request.
    * 
    * @param {object} req - The request object.
    * @param {Array<string>} params - Array of required body parameter keys.
    * @returns {object} - Returns status object indicating whether parameters are valid or not.
    */
   reqPost: (req, params = []) => {
      const missingParams = params.filter(key => !(key in req.body) || !req.body[key])
      if (missingParams.length > 0) {
         return {
            creator: global.creator,
            status: false,
            msg: `Parameter${missingParams.length > 1 ? 's' : ''} ${formatList(missingParams)} ${missingParams.length > 1 ? 'are' : 'is'} required`
         }
      }
      return { status: true }
   },

   /**
    * Validates if a given string is a valid URL.
    * 
    * @param {string} url - The string to be checked as a URL.
    * @returns {object} - Returns status object indicating whether the string is a valid URL.
    */
   url: (url) => {
      try {
         new URL(url)
         return { status: true }
      } catch {
         return {
            creator: global.creator,
            status: false,
            msg: 'Argument must be of type URL!'
         }
      }
   },

   /**
    * Validates if a given string is a valid number.
    * 
    * @param {string} str - The string to be checked as a number.
    * @returns {object} - Returns status object indicating whether the string is a valid number.
    */
   number: (str) => {
      if (isNaN(str)) {
         return {
            creator: global.creator,
            status: false,
            msg: 'Argument must be of type number!'
         }
      }
      return { status: true }
   },

   /**
    * Predefined response for invalid URLs.
    * 
    * @returns {object} - Returns an object indicating that the URL is invalid.
    */
   invalidURL: {
      creator: global.creator,
      status: false,
      msg: 'Invalid URL!'
   },

   /**
    * Generic error response.
    * 
    * @param {string} [msg='Something went wrong'] - Optional custom error message.
    * @returns {object} - Returns a generic error response object with the given message.
    */
   error: (msg = 'Something went wrong') => ({
      creator: global.creator,
      status: false,
      msg
   }),

   /**
    * Middleware to cache requests based on IP and parameters.
    * If an identical request (same IP and parameters) is detected,
    * it holds the request and returns a 429 status.
    *
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    * @param {Function} next - Express next middleware function
    */
   caching: (req, res, next) => {
      const ip = requestIp.getClientIp(req)
      const params = JSON.stringify(req.query || req.body)
      const cacheKey = Buffer.from(`${ip}-${params}`).toString('base64')

      if (cache.has(cacheKey)) {
         console.log(`Cache hit for IP: ${ip} with same params, holding request`)
         return res.status(429).json({
            creator: global.creator,
            status: false,
            msg: 'Duplicate request detected, please wait'
         })
      }

      console.log(`Cache miss for IP: ${ip}, caching params`)
      cache.set(cacheKey, true)
      next()
   }
}

/**
 * Format a list of items into a human-readable string.
 * 
 * @param {Array<string>} list - The list of items to be formatted.
 * @returns {string} - A string representation of the list.
 */
const formatList = list => {
   if (list.length === 1) {
      return `'${list[0]}'`
   } else if (list.length === 2) {
      return `'${list[0]}' and '${list[1]}'`
   } else {
      const lastItem = list.pop();
      return `'${list.join(', ')}', and '${lastItem}'`
   }
}

// Export empty allowedIPs and collection arrays
export const allowedIPs = []
export const collection = []