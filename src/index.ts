import './lib/utils/config.js'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import ip from 'request-ip'
import morgan from 'morgan'

const PORT = process.env.PORT || 8080

const runServer = async (): Promise<void> => {
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
    .use(express.static(path.join(__dirname, 'public')))
    .use('/', await (await require('./handler')).createRouter())
    .get('*', (req: Request, res: Response) => res.status(404).json({
      creator: global.creator,
      status: false,
      msg: 'The page you are looking for was not found'
    }))

  app.disable('x-powered-by')
  app.use((req: Request, res: Response, next: Function) => {
    res.setHeader('X-Powered-By', 'NXR-SERVER')
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