global.creator = `@neoxr.js – Wildan Izzudin`
const NeoxrApi = require('@neoxr/api')
global.Api = new NeoxrApi('https://api.neoxr.my.id/api', process.env.API_KEY)
global.status = {
   reqGet: (req, params) => {
      if (!params) return ({
         status: true
      })
      const required = params.filter(key => !(key in req.query) || !req.query[key])
      if (required.length > 0) return ({
         creator: global.creator,
         status: false,
         msg: `parameter ${required.length > 1 ? '"' + required.slice(0, -1).join('", "') + '" and "' + required.slice(-1) + '"' : '"' + required[0] + '"'} is required`
      })
      return ({
         status: true
      })
   },
   reqPost: (req, params) => {
      if (!params) return ({
         status: true
      })
      const required = params.filter(key => !(key in req.body) || !req.body[key])
      if (required.length > 0) return ({
         creator: global.creator,
         status: false,
         msg: `parameter ${required.length > 1 ? required.slice(0, -1).join(', ') + ' and ' + required[required.length - 1]: required[0]} is required`
      })
      return ({
         status: true
      })
   },
   url: (url) => {
      try {
         new URL(url)
         return ({
            status: true
         })
      } catch {
         return ({
            creator: global.creator,
            status: false,
            msg: 'argument must be of type url!'
         })
      }
   },
   number: (str) => {
      if (isNaN(str)) return ({
         creator: global.creator,
         status: false,
         msg: 'argument must be of type number!'
      })
      return ({
         status: true
      })
   },
   invalidURL: {
      creator: global.creator,
      status: false,
      msg: 'invalid URL!'
   },
   error: (msg) => {
      return ({
         creator: global.creator,
         status: false,
         msg: msg || 'Something went wrong'
      })
   }
}


module.exports = {
   collection: []
}