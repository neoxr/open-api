const Jwt = require('jsonwebtoken')

class FunctionHelper {
   makeId(length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   isUrl(url) {
      try {
         new URL(url)
         return true
      } catch {
         return false
      }
   }

   uuid() {
      const dt = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         const r = (dt + Math.random() * 16) % 16 | 0
         return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
   }

   ucword(str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
         return $1.toUpperCase()
      })
   }

   delay(time) {
      return new Promise(res => setTimeout(res, time))
   }

   randomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   genTokenFromUrl(url, cookie) {
      try {
         const expiresIn = 60 * 5
         const token = Jwt.sign(
            { url: url, cookie: cookie },
            process.env.JWT_SECRET,
            { expiresIn }
         )
         return token
      } catch (error) {
         return false
      }
   }
}

module.exports = new FunctionHelper