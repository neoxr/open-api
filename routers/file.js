import { Function as Func } from '../lib/index.js'
import { extension } from 'mime-types'
import Jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
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
            sendErrorFile(res, e.message)
         })
         stream.on("response", (response) => {
            res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream")
            res.setHeader("Content-Length", response.headers["content-length"])
            const filename = 'neoxr-' + Func.makeId(6) + '.' + (extension(response.headers['content-type']) || 'bin')
            res.setHeader("Content-Disposition", "attachment; filename=" + filename)
         })
         stream.pipe(res).on('error', e => {
            sendErrorFile(res, e.message)
         })
      } catch (e) {
         sendErrorFile(res, 'Token Expired!')
      }
   },
   error: false
}

const sendErrorFile = (res, errorMessage) => {
   const errorFilePath = path.join(process.cwd(), 'error.txt')

   // Menulis error ke file .txt
   fs.writeFileSync(errorFilePath, errorMessage)

   // Mengirim file error ke klien
   res.status(500).sendFile(errorFilePath, (err) => {
      if (err) {
         console.error("Error sending error file:", err.message)
         res.status(500).send("Error sending error file")
      }
   })
}