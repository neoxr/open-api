import Webly, { App, Loader } from '@neoxr/webly'
import middleware from './lib/system/middleware.js'
import os from 'node:os'
await Loader.scraper('./lib/scraper')

const app = new App({
   name: 'Open-API',
   staticPath: ['public'],
   routePath: './routers',
   middleware,
   socket: true,
   port: 3001,
   error: (req, res) => {
      res.status(404).sendFile('./public/404.html', { root: process.cwd() })
   }
})

app?.socket?.on('connection', (socket) => {
   console.log(`Client connected: ${socket.id}`);

   const systemMonitorInterval = setInterval(() => {
      const totalMemory = os.totalmem()
      const freeMemory = os.freemem()
      const usedMemory = totalMemory - freeMemory
      const usagePercentage = (usedMemory / totalMemory) * 100

      const formattedData = {
         total: `${(totalMemory / 1024 / 1024).toFixed(2)} MB`,
         free: `${(freeMemory / 1024 / 1024).toFixed(2)} MB`,
         used: `${(usedMemory / 1024 / 1024).toFixed(2)} MB`,
         usagePercentage: usagePercentage.toFixed(2)
      }

      socket.emit('system_update', formattedData)

   }, 2000)

   socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
      clearInterval(systemMonitorInterval)
   })
})

app.start()