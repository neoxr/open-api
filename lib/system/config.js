global.creator = `@neoxr.js – Wildan Izzudin`
global.status = {
   reqGet: (req, params) => {
      if (!params) return ({
         status: true
      })
      const required = params.filter(key => !(key in req.query) || !req.query[key])
      if (required.length > 0) return ({
         creator: global.creator,
         status: false,
         msg: `Parameter ${required.length > 1 ? '"' + required.slice(0, -1).join('", "') + '" and "' + required.slice(-1) + '"' : '"' + required[0] + '"'} required`
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
         msg: `Parameter ${required.length > 1 ? required.slice(0, -1).join(', ') + ' and ' + required[required.length - 1]: required[0]} required`
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
            msg: 'Input must be a url!'
         })
      }
   },
   number: (str) => isNaN(str) ? ({
      creator: global.creator,
      status: false,
      msg: 'Input must be a number!'
   }) : ({
      status: true
   }),
   invalidURL: {
      creator: global.creator,
      status: false,
      msg: 'Invalid URL!'
   },
   invalidKey: {
      creator: global.creator,
      status: false,
      msg: 'Sorry, apikey is not registered. © https://api.neoxr.my.id'
   },
   limit: {
      creator: global.creator,
      status: false,
      msg: 'Sorry, apikey has reached the limit. © https://api.neoxr.my.id'
   },
   error: (msg) => {
      return ({
         creator: global.creator,
         status: false,
         msg
      })
   }
}

module.exports = {
   collection: []
}