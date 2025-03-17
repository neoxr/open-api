import { readdir as fsReaddir, stat as fsStat } from 'fs/promises'
import { resolve, basename } from 'path'

/**
 * Class responsible for loading plugins and scrapers dynamically
 * by scanning a specified directory for JavaScript files.
 */
class Loader {
   constructor() {
      this.plugins = []  // Array to store plugins after loading
      this.scrapers = [] // Array to store scrapers after loading
   }

   /**
    * Scans a directory recursively to find all files and subdirectories.
    * 
    * @param {string} dir - Directory path to scan.
    * @returns {Promise<string[]>} - Array of file paths from the directory and its subdirectories.
    */
   async scan(dir) {
      // Get the list of files and subdirectories in the given directory
      let subdirs = await fsReaddir(dir)
      
      // Recursively scan each subdirectory and get its files
      let files = await Promise.all(subdirs.map(async (subdir) => {
         let res = resolve(dir, subdir)
         return (await fsStat(res)).isDirectory() ? this.scan(res) : res
      }))
      
      // Return all files flattened into a single array
      return files.flat()
   }

   /**
    * Dynamically requires a module from a file path and returns an instance
    * of the module if it exports a function or object.
    * 
    * @param {string} file - Path to the JavaScript file to require.
    * @returns {Promise<any>} - The module or null if loading fails.
    */
   async dynamicRequire(file) {
      try {
         // Dynamically import the module from the file
         const module = await import(file)
         
         // Return the module, or create an instance if it is a constructor
         return (typeof module === 'function' || (typeof module === 'object' && module !== null && module.constructor)) 
            ? new module()
            : module
      } catch (error) {
         console.error(`Failed to require the module from ${file}:`, error)
         return null
      }
   }

   /**
    * Scans a directory for JavaScript files and loads them as plugins.
    * Plugins are stored in the `this.plugins` object.
    * 
    * @param {string} dir - Directory path containing plugin files.
    * @returns {Promise<void>} - Resolves when all plugins are loaded.
    */
   async router(dir) {
      const files = await this.scan(dir)

      // Load JavaScript files and store them in `this.plugins` as key-value pairs
      const pluginsArray = await Promise.all(
         files
            .filter(v => v.endsWith('.js')) // Only process .js files
            .map(async file => {
               const plugin = await import(file)
               return [basename(file).replace('.js', ''), plugin.default || plugin]
            })
      )
      
      // Store the plugins in an object, with the filename as the key (without extension)
      this.plugins = Object.fromEntries(pluginsArray)
   }

   /**
    * Scans a directory for JavaScript files and loads them as scrapers.
    * Scrapers are stored in the `this.scrapers` object.
    * 
    * @param {string} dir - Directory path containing scraper files.
    * @returns {Promise<void>} - Resolves when all scrapers are loaded.
    */
   async scraper(dir) {
      const files = await this.scan(dir)

      // Load JavaScript files and store them in `this.scrapers` as key-value pairs
      const scrapersArray = await Promise.all(
         files
            .filter(v => v.endsWith('.js')) // Only process .js files
            .map(async file => {
               const scraper = await this.dynamicRequire(file)
               return [basename(file).replace('.js', ''), scraper.default || scraper]
            })
      )
      
      // Store the scrapers in an object, with the filename as the key (without extension)
      this.scrapers = Object.fromEntries(scrapersArray)
   }
}

// Export an instance of the Loader class to use in other modules
export default new Loader