const { collection } = require('../lib/system/config')
exports.routes = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req, res, next) => {
      const model = collection.sort(function(a, b) {
         if (a.name < b.name) {
            return -1
         }
         if (a.name > b.name) {
            return 1
         }
         return 0
      })
      const page = parseInt(req.query.page || 1)
      const limit = parseInt(req.query.limit || 8)
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const result = {}
      if (endIndex < model.length) {
         result.next = {
            page: page + 1,
            limit: limit
         }
      }
      if (startIndex > 0) {
         result.previous = {
            page: page - 1,
            limit: limit,
         }
      }
      result.results = model.slice(startIndex, endIndex)
      res.render(process.cwd() + '/public/index', {
         data: {
            title: process.env.SITE_NAME,
            description: 'Hi, this is me!',
            collection: result.results,
         },
         pages: {
            next: result.next,
            previous: result.previous
         }
      })
   },
   error: false
}