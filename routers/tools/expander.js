exports.routes = {
   name: 'URL Expander',
   category: 'tools',
   path: '/api/url-expander',
   parameter: ['url'],
   example: {
      url: 'https://encr.pw/M9pQK'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const json = await _.Scraper.expander(req.query.url)
      res.json(json)
   },
   error: false
}