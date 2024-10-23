require('./lib/system/config.js'), require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const ip = require('request-ip')
const morgan = require('morgan')
const PORT = process.env.PORT || 8080
const runServer = async () => {
   const app = express()
   morgan.token('clientIp', (req) => req.clientIp)
   app.set('json spaces', 3)
      .set('view engine', 'ejs')
      .engine('ejs', require('ejs').__express)
      .use(express.json())
      .use(ip.mw())
      .use(morgan(':clientIp :method :url :status :res[content-length] - :response-time ms'))
      .use(bodyParser.json({
         limit: '50mb'
      }))
      .use(bodyParser.urlencoded({
         limit: '50mb',
         extended: true,
         parameterLimit: 50000
      }))
      .use(express.static(path.join(__dirname, 'public')))
      .use('/', await require('./handler'))
      .get('*', (req, res) => res.status(404).json({
         creator: global.creator,
         status: false,
         msg: 'the page you are looking for was not found'
      }))
   app.disable('x-powered-by')
   app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'NXR-SERVER')
      next()
   })
   app.listen(PORT, () => {
      const CFonts = require('cfonts')
      CFonts.say('Open-API', {
         font: 'tiny',
         align: 'center',
         colors: ['system']
      }), CFonts.say('Github : https://github.com/neoxr/open-api', {
         colors: ['system'],
         font: 'console',
         align: 'center'
      })
      console.log(chalk.yellowBright.bold('Server listening on PORT --->', PORT))
   })
}

runServer().catch(() => runServer())