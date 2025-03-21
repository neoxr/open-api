import CryptoJS from 'crypto-js'
import { format } from 'date-fns'

const keySize = 256
const ivSize = 128
const iterations = 100

export const encrypt = (data: string, secret: string = 'neoxr'): string => {
   const salt = CryptoJS.lib.WordArray.random(128 / 8)
   const key = CryptoJS.PBKDF2(secret, salt, {
      keySize: keySize / 32,
      iterations: iterations
   })
   const iv = CryptoJS.lib.WordArray.random(ivSize / 8)

   const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
   })

   const encryptedData = salt.toString() + iv.toString() + encrypted.toString()
   return encryptedData
}

export const decrypt = (encryptedData: string, secret: string = 'neoxr'): string => {
   const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32))
   const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32))
   const encrypted = encryptedData.substring(64)

   const key = CryptoJS.PBKDF2(secret, salt, {
      keySize: keySize / 32,
      iterations: iterations
   })

   const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
   })

   return decrypted.toString(CryptoJS.enc.Utf8)
}

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const toUcwords = (str: string): string => str.replace(/\b\w/g, (char) => char.toUpperCase())

export const h2k = (number: number): string => {
   if (number >= 1000) {
      const divided = number / 1000
      return divided % 1 === 0
         ? divided.toLocaleString('en-US', { maximumFractionDigits: 0 }) + 'K'
         : divided.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'K'
   }
   return number.toLocaleString('en-US')
}

export const formatter = (value: string): string => parseInt(value).toLocaleString()

export const formatDate = (date: string): string => format(parseInt(date), 'dd/MM/y - HH:mm:ss')

export const toMs = (time: string): number => {
   const timeValue = parseInt(time.slice(0, -1))
   const timeUnit = time.slice(-1).toLowerCase()

   switch (timeUnit) {
      case 'h':
         return timeValue * 3600000
      case 'm':
         return timeValue * 60000
      case 's':
         return timeValue * 1000
      default:
         throw new Error("Unit not recognized! Use 'h', 'm', or 's'.")
   }
}

export const base64decode = (str: string): string => window.atob(str)

export const base64encode = (str: string): string => window.btoa(str)

export const bytesToSize = (bytes: number): string => {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (bytes === 0) return '0 Byte'
   const i = Math.floor(Math.log(bytes) / Math.log(1024))
   return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncate = (name: string, maxLength: number): string => {
   if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'
   }
   return name
}

export const formatAndCensor = (number: number): string => {
   let formattedNumber = number.toLocaleString()
   let censoredPart = formattedNumber.slice(0, formattedNumber.length - 4).replace(/\d/g, '*')
   let visiblePart = formattedNumber.slice(formattedNumber.length - 4)

   return censoredPart + visiblePart
}
