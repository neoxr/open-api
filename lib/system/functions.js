import Jwt from 'jsonwebtoken'

class Function {
   makeId = (length) => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   isUrl = url => {
      try {
         new URL(url)
         return true
      } catch {
         return false
      }
   }

   uuid = () => {
      var dt = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         var r = (dt + Math.random() * 16) % 16 | 0;
         var y = Math.floor(dt / 16);
         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      })
      return uuid
   }

   delay = time => new Promise(res => setTimeout(res, time))

   randomInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   genTokenFromUrl = (url, cookie) => {
      try {
         const expiresIn = 60 * 5
         const token = Jwt.sign({
            url: url,
            cookie: cookie
         }, process.env.JWT_SECRET, { expiresIn })
         return token
      } catch (error) {
         return false
      }
   }
}

export default new Function