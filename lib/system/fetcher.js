import axios from 'axios'

/**
 * Class that provides methods for making various types of HTTP requests
 * such as GET, POST, PUT, DELETE, PATCH, and downloading files.
 */
class Fetcher {
   /**
    * Perform a GET request to the specified URL.
    * 
    * @param {string} url - The URL to send the GET request to.
    * @param {object} [options={}] - Optional configuration for the GET request.
    * @returns {Promise<any>} - The response data.
    * @throws {Error} - Throws an error if the GET request fails.
    */
   async _get(url, options = {}) {
      try {
         const response = await axios.get(url, options)
         return response.data
      } catch (err) {
         console.error(`GET request failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Perform a POST request to the specified URL with the given payload.
    * 
    * @param {string} url - The URL to send the POST request to.
    * @param {object} payload - The data to send in the body of the POST request.
    * @param {object} [options={}] - Optional configuration for the POST request.
    * @returns {Promise<any>} - The response data.
    * @throws {Error} - Throws an error if the POST request fails.
    */
   async _post(url, payload, options = {}) {
      try {
         const response = await axios.post(url, payload, options)
         return response.data
      } catch (err) {
         console.error(`POST request failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Retrieve the direct response URL from a GET request.
    * 
    * @param {string} url - The URL to send the GET request to.
    * @param {object} [options={}] - Optional configuration for the GET request.
    * @returns {Promise<string>} - The direct URL from the response.
    * @throws {Error} - Throws an error if the request fails.
    */
   async _direct(url, options = {}) {
      try {
         const response = await axios.get(url, options)
         return response.request.res.responseUrl
      } catch (err) {
         console.error(`Direct URL fetch failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Perform a PUT request to the specified URL with the given payload.
    * 
    * @param {string} url - The URL to send the PUT request to.
    * @param {object} payload - The data to send in the body of the PUT request.
    * @param {object} [options={}] - Optional configuration for the PUT request.
    * @returns {Promise<any>} - The response data.
    * @throws {Error} - Throws an error if the PUT request fails.
    */
   async _put(url, payload, options = {}) {
      try {
         const response = await axios.put(url, payload, options)
         return response.data
      } catch (err) {
         console.error(`PUT request failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Perform a DELETE request to the specified URL.
    * 
    * @param {string} url - The URL to send the DELETE request to.
    * @param {object} [options={}] - Optional configuration for the DELETE request.
    * @returns {Promise<any>} - The response data.
    * @throws {Error} - Throws an error if the DELETE request fails.
    */
   async _delete(url, options = {}) {
      try {
         const response = await axios.delete(url, options)
         return response.data
      } catch (err) {
         console.error(`DELETE request failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Perform a PATCH request to the specified URL with the given payload.
    * 
    * @param {string} url - The URL to send the PATCH request to.
    * @param {object} payload - The data to send in the body of the PATCH request.
    * @param {object} [options={}] - Optional configuration for the PATCH request.
    * @returns {Promise<any>} - The response data.
    * @throws {Error} - Throws an error if the PATCH request fails.
    */
   async _patch(url, payload, options = {}) {
      try {
         const response = await axios.patch(url, payload, options)
         return response.data
      } catch (err) {
         console.error(`PATCH request failed for ${url}:`, err.message)
         throw err
      }
   }

   /**
    * Download a file from the specified URL and save it to a destination.
    * 
    * @param {string} url - The URL to download the file from.
    * @param {string} destination - The path where the file will be saved.
    * @param {object} [options={}] - Optional configuration for the download request.
    * @returns {Promise<void>} - Resolves when the download is complete.
    * @throws {Error} - Throws an error if the download fails.
    */
   async _download(url, destination, options = {}) {
      const fs = await import('fs')
      const { createWriteStream } = fs.default

      try {
         // Perform a GET request with responseType: 'stream' to download the file
         const response = await axios.get(url, { ...options, responseType: 'stream' })

         // Create a writable stream to save the file to the destination
         const writer = createWriteStream(destination)
         response.data.pipe(writer)

         // Return a promise that resolves when the file is fully downloaded
         return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
         })
      } catch (err) {
         console.error(`File download failed for ${url}:`, err.message)
         throw err
      }
   }
}

// Export an instance of Fetcher class for use in other modules
export default new Fetcher