const { readdir, stat } = require('fs/promises')
const { resolve, basename } = require('path')

class Loader {
   constructor() {
      this.plugins = []
      this.scrapers = []
   }

   async scan(dir) {
      const subdirs = await readdir(dir)
      const files = await Promise.all(
         subdirs.map(async subdir => {
            const res = resolve(dir, subdir)
            return (await stat(res)).isDirectory() ? this.scan(res) : res
         })
      )
      return files.flat()
   }

   async dynamicRequire(file) {
      try {
         const mod = require(file)
         return (typeof mod === 'function' || (typeof mod === 'object' && mod !== null && mod.constructor))
            ? new mod()
            : mod
      } catch (error) {
         console.error(`Failed to require the module from ${file}:`, error)
         return null
      }
   }

   async router(dir) {
      const files = await this.scan(dir)
      const pluginsArray = await Promise.all(
         files
            .filter(v => v.endsWith('.js'))
            .map(async file => {
               const plugin = require(file)
               return [basename(file).replace('.js', ''), plugin.default || plugin]
            })
      )
      this.plugins = Object.fromEntries(pluginsArray)
   }

   async scraper(dir) {
      const files = await this.scan(dir)
      const scrapersArray = await Promise.all(
         files
            .filter(v => v.endsWith('.js'))
            .map(async file => {
               const scraper = await this.dynamicRequire(file)
               return [basename(file).replace('.js', ''), scraper.default || scraper]
            })
      )
      this.scrapers = Object.fromEntries(scrapersArray)
   }
}

module.exports = new Loader