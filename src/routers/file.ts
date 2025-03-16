import { Function as Func } from '../lib'
import { extension } from 'mime-types'
import Jwt from 'jsonwebtoken'
import { got } from 'got'

export const routes = {
   category: 'main',
   path: '/file/:token',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { token } = req.params
         const decoded = Jwt.verify(token, process.env.JWT_SECRET)
         const url = decoded?.url
         const cookie = decoded?.cookie
         if (cookie) {
            var stream = await got.stream(url, {
               headers: {
                  cookie
               }
            })
         } else {
            var stream = await got.stream(url)
         }
         stream.on('error', e => {
            res.status(500).send(e.message)
         })
         stream.on('response', (response) => {
            if (response?.statusCode !== 200) {
               res.status(response.statusCode).send('Failed to fetch file')
               stream.destroy()
               return
            }
            res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream')
            res.set('Content-Length', response.headers['content-length'] || 0)
            const filename = Func.makeId(6) + '.' + (extension(response.headers['content-type']) || 'bin')
            res.set('Content-Disposition', 'attachment; filename=' + filename)
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
            res.set('Pragma', 'no-cache')
            res.set('Expires', '0')
         })
         stream.pipe(res).on('error', e => {
            res.status(500).send(e.message)
            res.destroy(e)
         })
      } catch (e) {
         res.status(500).send(e.message)
      }
   },
   error: false
}