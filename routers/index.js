exports.routes = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req, res, next) => {
      res.json({
         creator: global.creator,
         status: true,
         msg: 'Hello World ^_^'
      })
   },
   error: false
}