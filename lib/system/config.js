global.creator = `@neoxr.js – Wildan Izzudin`
global.status = {
   required: (req, params) => {
      const required = params.filter(key => !(key in req.query) || !req.query[key])
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
   invalidURL: {
      creator: global.creator,
      status: false,
      msg: 'Invalid URL!'
   },
   error: (msg) => {
      return ({
         creator: global.creator,
         status: false,
         msg
      })
   }
}