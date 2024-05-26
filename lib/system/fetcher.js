const axios = require('axios')

module.exports = class Fetcher {
   async _get(url, options = {}) {
      const result = await (await axios.get(url, options)).data
      return result
   }
   
   async _post(url, payload, options = {}) {
      const result = await (await axios.post(url, payload, options)).data
      return result
   }
   
   async _direct(url, optoons = {}) {
      const result = await (await axios.get(url)).request.res.responseUrl
      return result
   }
}