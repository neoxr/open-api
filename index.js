require('./lib/system/config.js'), require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080

const runServer = async () => {
   const app = express()
   app.set('json spaces', 2)
      .set('view engine', 'ejs')
      .engine('ejs', require('ejs').__express)
      .use(express.json())
      .use(require('morgan')('dev'))
      .use(bodyParser.json({
         limit: '50mb'
      }))
      .use(bodyParser.urlencoded({
         limit: '50mb',
         extended: true,
         parameterLimit: 50000
      }))
      .use(express.static(path.join(__dirname, 'public')))
   app.use('/', await require('./handler'))
   app.get('*', (req, res) => res.render(process.cwd() + '/public/404'))
   app.disable('x-powered-by')
   app.listen(PORT, () => {
      const CFonts = require('cfonts')
      CFonts.say('WEB 0.1', {
         font: 'tiny',
         align: 'center',
         colors: ['system']
      }), CFonts.say('Github : https://github.com/neoxr/webapi', {
         colors: ['system'],
         font: 'console',
         align: 'center'
      })
      console.log(`Server is running in port ${PORT}`)
   })
}

runServer().catch(() => runServer())