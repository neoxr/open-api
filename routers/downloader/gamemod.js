exports.routes = {
   name: 'Game Mod',
   category: 'downloader',
   path: '/api/gamemod',
   parameter: ['q'],
   example: {
      q: 'race'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { q } = req.query
      const json = await _.Api.neoxr('/an1', {
         q
      })
      res.json(json)
   },
   error: false
}