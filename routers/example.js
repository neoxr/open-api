exports.routes = {
   category: 'main',
   path: '/song',
   parameter: ['q'],
   method: 'get',
   execution: async (req, res, next) => {
      const { q } = req.query
      const json = await Api.neoxr('/song', {
         q
      })
      res.json(json)
   },
   error: false
}