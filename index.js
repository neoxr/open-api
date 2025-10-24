import Webly, { App, Loader } from '@neoxr/webly'
import middleware from './lib/system/middleware.js'

await Loader.scraper('./lib/scraper')

const app = new App({
   name: 'Open-API',
   staticPath: './public',
   routePath: './routers',
   middleware,
   port: 3000
})

app.start()