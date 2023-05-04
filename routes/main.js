const shorten = require('../lib/sid')
const routes = async (fastify, options) => {
   fastify.get('/', async (req, res) => {
      return ({
         creator: global.creator,
         status: true,
         msg: `Welcome!`
      })
   })

   fastify.get('/short', async (req, res) => {
      const url = req.query.url
      if (!url) return ({
         creator: global.creator,
         status: false,
         msg: `"url" parameter required!`
      })
      const json = await shorten(url)
      return res.send(json)
   })
}

module.exports = routes