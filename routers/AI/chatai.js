exports.routes = {
   name: 'Chat AI',
   category: 'AI',
   path: '/api/chat',
   parameter: ['id', 'msg'],
   example: {
      id: '268827',
      msg: 'hi'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { id, msg } = req.query
      const json = await _.Api.neoxr('/chat', {
         id, msg
      })
      res.json(json)
   },
   error: false
}