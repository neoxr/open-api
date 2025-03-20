import Jwt from 'jsonwebtoken'

class Function {
   makeId = (length: number): string => {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   isUrl = (url: string): boolean => {
      try {
         new URL(url)
         return true
      } catch {
         return false
      }
   }

   uuid = (): string => {
      const dt = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         const r = (dt + Math.random() * 16) % 16 | 0
         const y = Math.floor(dt / 16)
         return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
   }

   ucword = (str: string): string => {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
         return $1.toUpperCase();
      })
   }

   delay = (time: number): Promise<void> => new Promise(res => setTimeout(res, time))

   randomInt = (min: number, max: number): number => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   genTokenFromUrl = (url: string, cookie: string): string | false => {
      try {
         const expiresIn = 60 * 5
         const token = Jwt.sign({
            url: url,
            cookie: cookie
         }, process.env.JWT_SECRET as string, { expiresIn })
         return token
      } catch (error) {
         return false
      }
   }
}

export default new Function