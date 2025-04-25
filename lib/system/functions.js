import axios from 'axios'
import Jwt from 'jsonwebtoken'

class Function {
   /**
    * Generate a random ID of the specified length
    * @param {number} length - The length of the ID to generate.
    * @returns {string} - A random string of the given length.
    */
   makeId = (length) => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   /**
    * Check if a given string is a valid URL.
    * @param {string} url - The string to check.
    * @returns {boolean} - True if the string is a valid URL, otherwise false.
    */
   isUrl = url => {
      try {
         new URL(url)
         return true
      } catch {
         return false
      }
   }

   /**
    * Convert input (URL or buffer) to a Buffer object.
    * @param {string|Buffer} i - The input to convert.
    * @returns {Buffer|null} - The converted buffer or null if conversion failed.
    */
   toBuffer = async i => {
      try {
         const file = Buffer.isBuffer(i) ? i : this.isUrl(i) ? await (await axios.get(i, {
            responseType: 'arraybuffer'
         })).data : null
         return file
      } catch (e) {
         return null
      }
   }

   /**
    * Generate a UUID (Universally Unique Identifier).
    * @returns {string} - A generated UUID.
    */
   uuid = () => {
      var dt = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         var r = (dt + Math.random() * 16) % 16 | 0;
         var y = Math.floor(dt / 16);
         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      })
      return uuid
   }

   /**
    * Format a size value to a human-readable format (e.g., KB, MB).
    * @param {number} size - The size to format.
    * @returns {string} - The formatted size as a string.
    */
   formatSize = (size) => {
      function round(value, precision) {
         var multiplier = Math.pow(10, precision || 0)
         return Math.round(value * multiplier) / multiplier
      }
      var megaByte = 1024 * 1024
      var gigaByte = 1024 * megaByte
      var teraByte = 1024 * gigaByte
      if (size < 1024) {
         return size + ' B'
      } else if (size < megaByte) {
         return round(size / 1024, 1) + ' KB'
      } else if (size < gigaByte) {
         return round(size / megaByte, 1) + ' MB'
      } else if (size < teraByte) {
         return round(size / gigaByte, 1) + ' GB'
      } else {
         return round(size / teraByte, 1) + ' TB'
      }
      return ''
   }

   /**
    * Format time in milliseconds to a human-readable format (HH:MM:SS).
    * @param {number} duration - The time duration in milliseconds.
    * @returns {string} - The formatted time as a string.
    */
   timeout = (duration) => {
      let milliseconds = parseInt((duration % 1000) / 100),
         seconds = Math.floor((duration / 1000) % 60),
         minutes = Math.floor((duration / (1000 * 60)) % 60),
         hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
         days = Math.floor(duration / (24 * 60 * 60 * 1000))
      let hoursF = (hours < 10) ? "0" + hours : hours
      let minutesF = (minutes < 10) ? "0" + minutes : minutes
      let secondsF = (seconds < 10) ? "0" + seconds : seconds
      let daysF = (days < 10) ? "0" + days : days
      return hoursF + ":" + minutesF + ":" + secondsF
   }

   /**
    * Check if a string exceeds a given size limit.
    * @param {string} str - The string to check.
    * @param {number} max - The maximum allowed size in MB.
    * @returns {Object} - An object indicating if the size is within the limit.
    */
   sizeLimit = (str, max) => {
      let data
      if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
         oversize: true
      }
      if (str.match('M') || str.match('MB')) {
         let first = str.replace(/MB|M|G|T/g, '').trim()
         if (isNaN(first)) return data = {
            oversize: true
         }
         if (first > max) return data = {
            oversize: true
         }
         return data = {
            oversize: false
         }
      } else {
         return data = {
            oversize: false
         }
      }
   }

   /**
    * Remove an item from an array.
    * @param {Array} arr - The array to modify.
    * @param {any} value - The value to remove from the array.
    * @returns {Array} - The modified array.
    */
   removeItem = (arr, value) => {
      let index = arr.indexOf(value)
      if (index > -1) arr.splice(index, 1)
      return arr
   }

   /**
    * Delay execution for a specified amount of time.
    * @param {number} time - The time to wait in milliseconds.
    * @returns {Promise} - A promise that resolves after the delay.
    */
   delay = time => new Promise(res => setTimeout(res, time))

   /**
    * Generate a random integer between a given range.
    * @param {number} min - The minimum value (inclusive).
    * @param {number} max - The maximum value (inclusive).
    * @returns {number} - A random integer.
    */
   randomInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   /**
    * Generate a JWT token from a URL, filename, and cookie.
    * @param {string} url - The URL for which the token is generated.
    * @param {string} filename - The filename associated with the URL.
    * @param {string} cookie - The cookie to include in the token.
    * @returns {string|boolean} - The generated token or false if generation failed.
    */
   genTokenFromUrl = (url, filename, cookie) => {
      try {
         const expiresIn = 60 * 5
         const token = Jwt.sign({
            url: url,
            filename: encodeURIComponent(filename),
            cookie: cookie
         }, process.env.JWT_SECRET, { expiresIn })
         return token
      } catch (error) {
         return false
      }
   }

   /**
    * Capitalize the first letter of each word in a string.
    * @param {string} str - The string to modify.
    * @returns {string} - The modified string with the first letter of each word capitalized.
    */
   ucword = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase())
   }
}

export default new Function