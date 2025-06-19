import './lib/Utils/config.js'
import { Database } from './lib/index.js'
import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import ip from 'request-ip'
import fs from 'fs'
import morgan from 'morgan'
import createRouter from './lib/Utils/defineRoute'

const PORT = process.env.PORT || 8080

const runServer = async (): Promise<void> => {
   global.db = new Database
   const app = express()

   morgan.token('clientIp', (req: Request) => req.clientIp)

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

   await (new createRouter(app)).load(path.join(process.cwd(), 'routers'))

   if (fs.existsSync(path.join(process.cwd(), 'public'))) {
      app.use(express.static(path.join(process.cwd(), 'public')))

      app.get('*', (_req: Request, res: Response) => {
         res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
      })
   } else {
      app.use((_req: Request, res: Response) => {
         res.status(404).json({
            creator: global.creator,
            status: false,
            msg: 'The page you are looking for was not found'
         })
      })
   }

   app.disable('x-powered-by')
   app.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-Powered-By', 'Neoxr Creative')
      next()
   })

   app.listen(PORT, () => {
      const CFonts = require('cfonts')
      CFonts.say('Open-API', {
         font: 'tiny',
         align: 'center',
         colors: ['system']
      })
      CFonts.say('Github: https://github.com/neoxr/open-api', {
         colors: ['system'],
         font: 'console',
         align: 'center'
      })
      console.log(chalk.yellowBright.bold('Server listening on PORT --->', PORT))
   })
}

runServer().catch(() => runServer())