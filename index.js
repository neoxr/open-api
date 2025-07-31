import 'dotenv/config'
import './lib/system/config.js'
import { Loader } from './lib/index.js'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import requestIp from 'request-ip'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import CFonts from 'cfonts'
import ejs from 'ejs'
import timeout from 'connect-timeout'
import createRouter from './lib/system/defineRoute.js'
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const runServer = async () => {
   // Dynamically load the scraper module before starting the server
   await Loader.scraper(path.join(process.cwd(), 'lib/scraper'))
   const app = express()

   app.set('json spaces', 3)
      .set('view engine', 'ejs')
      .engine('ejs', ejs.__express)
      .use(timeout('300s')) // 5 minutes
      .use((req, res, next) => {
         if (!req.timedout) next()
      })
      .use(express.json())
      .use(requestIp.mw())
      .use(morgan((tokens, req, res) => {
         if (req.method !== 'OPTIONS') {
            return [
               req.clientIp,
               tokens.method(req, res),
               tokens.url(req, res),
               tokens.status(req, res),
               tokens.res(req, res, 'content-length'), '-',
               tokens['response-time'](req, res), 'ms'
            ].join(' ')
         }
      }))
      .use(bodyParser.json({ limit: '50mb' }))
      .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
      .use(express.static(path.join(__dirname, 'public')))

   // Dynamically import the request handler module
   await (new createRouter(app)).load(path.join(process.cwd(), 'routers'))

   app.get('*', (req, res) => res.status(404).json({
      creator: global.creator,
      status: false,
      msg: 'the page you are looking for was not found'
   }))

   app.disable('x-powered-by')
   app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'Neoxr Creative Server')
      next()
   })

   app.listen(PORT, () => {
      console.clear()
      CFonts.say('Open-API', {
         font: 'tiny',
         align: 'center',
         colors: ['system']
      })
      CFonts.say('Github : https://github.com/neoxr/open-api', {
         colors: ['system'],
         font: 'console',
         align: 'center'
      })
      console.log(chalk.yellowBright.bold('Server listening on PORT --->', `http://localhost:${PORT}`))
   })
}

runServer().catch(() => {
   console.log(chalk.redBright.bold('Server error, trying to connect ...'))
   runServer()
})