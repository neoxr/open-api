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
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const runServer = async () => {
   // Dynamically load the scraper module before starting the server
   await Loader.scraper(path.join(process.cwd(), 'lib/scraper'))
   const app = express()

   morgan.token('clientIp', (req) => req.clientIp)

   app.set('json spaces', 3)
      .set('view engine', 'ejs')
      .engine('ejs', ejs.__express)
      .use(express.json())
      .use(requestIp.mw())
      .use(morgan(':clientIp :method :url :status :res[content-length] - :response-time ms'))
      .use(bodyParser.json({ limit: '50mb' }))
      .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
      .use(express.static(path.join(__dirname, 'public')));

   // Dynamically import the request handler module
   const handler = await import('./handler.js')
   app.use('/', await handler.default)

   app.get('*', (req, res) => res.status(404).json({
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
      console.log(chalk.yellowBright.bold('Server listening on PORT --->', PORT))
   })
}

runServer().catch(() => runServer())