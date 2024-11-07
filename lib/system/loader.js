import { readdir as fsReaddir, stat as fsStat } from 'fs/promises'
import { resolve, basename } from 'path'

class Loader {
   constructor() {
      this.plugins = []
   }

   async scan(dir) {
      let subdirs = await fsReaddir(dir)
      let files = await Promise.all(subdirs.map(async (subdir) => {
         let res = resolve(dir, subdir)
         return (await fsStat(res)).isDirectory() ? this.scan(res) : res
      }))
      return files.flat()
   }

   async router(dir) {
      const files = await this.scan(dir)
      const pluginsArray = await Promise.all(
         files
            .filter(v => v.endsWith('.js'))
            .map(async file => {
               const plugin = await import(file);
               return [basename(file).replace('.js', ''), plugin.default || plugin]
            })
      )
      this.plugins = Object.fromEntries(pluginsArray)
   }
}

export default new Loader
