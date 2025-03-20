import CryptoJS from 'crypto-js'
import { format } from 'date-fns'

const keySize = 256
const ivSize = 128
const iterations = 100

export const encrypt = (data, secret = 'neoxr') => {
   const salt = CryptoJS.lib.WordArray.random(128 / 8)
   const key = CryptoJS.PBKDF2(secret, salt, {
      keySize: keySize / 32,
      iterations: iterations
   });
   const iv = CryptoJS.lib.WordArray.random(ivSize / 8)

   const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
   })

   const encryptedData = salt.toString() + iv.toString() + encrypted.toString()
   return encryptedData
}

export const decrypt = (encryptedData, secret = 'neoxr') => {
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

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const toUcwords = str => str.replace(/\b\w/g, (char) => char.toUpperCase())

export const h2k = number => {
   if (number >= 1000) {
      const divided = number / 1000
      return divided % 1 === 0 ?
         divided.toLocaleString('en-US', { maximumFractionDigits: 0 }) + 'K' :
         divided.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'K'
   }
   return number.toLocaleString('en-US')
}

export const formatter = value => parseInt(value).toLocaleString()

export const formatDate = date => format(parseInt(date), 'dd/MM/y - HH:mm:ss')

export const toMs = time => {
   const timeValue = parseInt(time.slice(0, -1));
   const timeUnit = time.slice(-1).toLowerCase();

   switch (timeUnit) {
      case 'h':
         return timeValue * 3600000; // 1 jam = 3600000 ms
      case 'm':
         return timeValue * 60000; // 1 menit = 60000 ms
      case 's':
         return timeValue * 1000; // 1 detik = 1000 ms
      default:
         throw new Error("Unit not recognized! Use 'h', 'm', or 's'.")
   }
}

export const base64decode = str => window.atob(str)

export const base64encode = str => window.btoa(str)

export const bytesToSize = bytes => {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (bytes === 0) return '0 Byte'
   const i = Math.floor(Math.log(bytes) / Math.log(1024));
   return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncate = (name, maxLength) => {
   if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'
   }
   return name
}

export const makeChart = (element, title, labels, datasets = [], style = 'bar', options = {}) => {
   const barChartData = {
      labels: labels,
      datasets
   }
   const ctx = document.getElementById(element).getContext('2d')
   ctx.canvas.height = 200
   window.myBar = new Chart(ctx, {
      type: style,
      data: barChartData,
      options: {
         responsive: true,
         legend: { position: 'top' },
         plugins: {
            title: {
               display: true,
               text: title,
               font: { family: 'Share Tech Mono', size: 13, weight: 'bold' }
            },
            subtitle: {
               display: !1,
               text: "XXX",
               font: {
                  family: "Share Tech Mono",
                  size: 13,
                  weight: "bold"
               }
            },
            tooltip: {
               titleFont: {
                  family: "Share Tech Mono",
                  size: 12
               },
               bodyFont: {
                  family: "Share Tech Mono",
                  size: 12
               }
            },
            legend: {
               labels: {
                  font: {
                     family: "Share Tech Mono",
                     size: 11,
                     style: "normal"
                  }
               }
            }
         },
         ...options
      }
   })
}

export const formatAndCensor = number => {
   // Format number with thousand separator
   let formattedNumber = number.toLocaleString()

   // Sensor bagian dari angka
   let censoredPart = formattedNumber.slice(0, formattedNumber.length - 4).replace(/\d/g, '*')
   let visiblePart = formattedNumber.slice(formattedNumber.length - 4)

   return censoredPart + visiblePart
}