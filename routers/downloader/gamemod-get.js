exports.routes = {
   name: 'Game Mod (Get)',
   category: 'downloader',
   path: '/api/gamemod-get',
   parameter: ['url'],
   example: {
      url: 'https://an1.com/6808-mad-skills-motocross-3-mod.html'
   },
   method: 'get',
   execution: async (req, res, next) => {
      const _ = exports.routes.utils
      const { url } = req.query
      const json = await _.Api.neoxr('/an1-get', {
         url
      })
      res.json(json)
   },
   error: false
}