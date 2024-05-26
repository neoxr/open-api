exports.routes = {
   name: 'Song (Get)',
   category: 'downloader',
   path: '/api/song-get',
   parameter: ['q', 'select'],
   example: {
      q: 'to the bone - pamungkas',
      select: 1
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { q, select } = req.query
      const json = await _.Api.neoxr('/song', {
         q, select
      })
      res.json(json)
   },
   validator: (req, res, next) => {
      // its example a custom validator
      const { select } = req.query
      const check = global.status.number(select)
      if (!check.status) return res.json(check)
      next()
   },
   error: false
}