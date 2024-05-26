exports.routes = {
   name: 'Song',
   category: 'downloader',
   path: '/api/song',
   parameter: ['q'],
   example: {
      q: 'to the bone - pamungkas'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { q } = req.query
      const json = await _.Api.neoxr('/song', {
         q
      })
      res.json(json)
   },
   error: false
}