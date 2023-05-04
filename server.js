global.creator = `@neoxr.js – Wildan Izzudin`
const fastify = require('fastify')({
   logger: true
})

fastify.register(require('fastify-log'))
fastify.register(require('fastify-prettier'), {
   alwaysOn: true
})

fastify.addContentTypeParser('application/json', {
   parseAs: 'string'
}, function(req, body, done) {
   try {
      const json = JSON.parse(body)
      done(null, json)
   } catch (err) {
      err.statusCode = 400
      done(err, undefined)
   }
})

fastify.addContentTypeParser('*', function(request, payload, done) {
   let data = ''
   payload.on('data', chunk => {
      data += chunk
   })
   payload.on('end', () => {
      done(null, data)
   })
})

fastify.register(require('./app'))

fastify.listen({
   port: 3000,
   host: '0.0.0.0',
   backlog: 255
}, (err, address) => {
   if (err) throw err
   fastify.info(`Server is now listening on ${address}`)
})