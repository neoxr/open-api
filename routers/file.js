import { Function as Func } from '../lib/index.js'
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
         const fileUrl = decoded.url
         const stream = await got.stream(fileUrl)
         stream.on('error', e => {
            res.status(500).send(e.message)
         })
         stream.on("response", (response) => {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            res.setHeader("Pragma", "no-cache")
            res.setHeader("Expires", "0")
            res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream")
            res.setHeader("Content-Length", response.headers["content-length"] || 0)
            const filename = 'neoxr-' + Func.makeId(6) + '.' + (extension(response.headers['content-type']) || 'bin')
            res.setHeader("Content-Disposition", "attachment; filename=" + filename)
         })
         stream.pipe(res).on('error', e => {
            res.status(500).send(e.message)
         })
      } catch (e) {
         res.status(500).send(e.message)
      }
   },
   error: false
}