exports.routes = {
   category: 'main',
   path: '/api',
   method: 'get',
   execution: async (req, res, next) => {
      res.redirect('/')
   },
   error: false
}