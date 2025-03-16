import { readdir as fsReaddir, stat as fsStat } from 'fs/promises'
import { resolve, basename } from 'path'

class Loader {
   plugins: { [key: string]: any } = {}

   async scan(dir: string): Promise<string[]> {
      let subdirs = await fsReaddir(dir)
      let files = await Promise.all(subdirs.map(async (subdir) => {
         let res = resolve(dir, subdir)
         return (await fsStat(res)).isDirectory() ? this.scan(res) : res
      }))
      return files.flat()
   }

   async router(dir: string): Promise<void> {
      const files = await this.scan(dir)
      const pluginsArray = await Promise.all(
         files
            .filter(v => v.endsWith('.ts') || v.endsWith('.js'))
            .map(async file => {
               const plugin = await import(file)
               return [basename(file).replace(/\.(ts|js)$/, ''), plugin.default || plugin]
            })
      )
      this.plugins = Object.fromEntries(pluginsArray)
   }
}

export default new Loader()