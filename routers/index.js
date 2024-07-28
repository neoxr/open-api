exports.routes = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req, res, next) => {
      res.send('.')
   },
   error: false
}