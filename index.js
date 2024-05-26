require('./lib/system/config.js'), require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const PORT = process.env.PORT || 8080
const runServer = async () => {
   const app = express()
   app.set('json spaces', 2)
      .engine(Buffer.from('6a6d6b', 'hex').toString(), require(Buffer.from('657870726573732d68616e646c6562617273', 'hex').toString())({
         extname: Buffer.from('6a6d6b', 'hex').toString(),
         defaultLayout: '',
         partialsDir: [
            path.join(__dirname, 'public/partials/') // Specify the directory for partials
         ]
      }))
      .set('view engine', Buffer.from('6a6d6b', 'hex').toString())
      .set('views', path.join(__dirname, 'public'))
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
   app.get('*', (req, res) => res.render(process.cwd() + '/public/404', {
      data: {
         title: process.env.SITE_NAME
      }
   }))
   app.disable('x-powered-by')
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
      console.log(chalk.yellowBright.bold('Server listening on port --->', PORT))
   })
}

runServer().catch(() => runServer())