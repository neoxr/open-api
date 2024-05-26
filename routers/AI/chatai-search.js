exports.routes = {
   name: 'Chat AI (Search)',
   category: 'AI',
   path: '/api/chat-search',
   parameter: ['q'],
   example: {
      q: 'wolf'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { q } = req.query
      const json = await _.Api.neoxr('/chat', {
         q
      })
      res.json(json)
   },
   error: false
}