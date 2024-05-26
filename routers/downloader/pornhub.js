exports.routes = {
   name: 'Pornhub',
   category: 'downloader',
   path: '/api/pornhub',
   parameter: ['url'],
   example: {
      url: 'https://pornhub.com/xxxx'
   },
   method: 'get',
   execution: async (req, res, next) => {
      // this is an example of a plugin error xD
      res.send({
         creator: global.creator,
         status: false,
         msg: `feature is being maintained`
      })
   },
   error: true // is true
}