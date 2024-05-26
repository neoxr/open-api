exports.routes = {
   name: 'URL Cutter',
   category: 'tools',
   path: '/api/url-cutter',
   parameter: ['url'],
   example: {
      url: 'https://github.com/neoxr/webapi'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const json = await _.Scraper['url-cutter'].cut(req.query.url)
      res.json(json)
   },
   error: false
}