import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const resolve = path.resolve

const scandir = async (dir: string): Promise<string[]> => {
   let subdirs = await readdir(dir)
   let files = await Promise.all(subdirs.map(async (subdir) => {
      let res = resolve(dir, subdir)
      const isDirectory = (await stat(res)).isDirectory()
      return isDirectory ? scandir(res) : res
   }))
   return files.flat() as string[]
}

class Loader {
   plugins: { [key: string]: any } = []
   scrapers: { [key: string]: any } = []

   constructor() {
      this.plugins = []
      this.scrapers = []
   }

   require = (file: string): any => {
      try {
         return new (require(file))
      } catch {
         return require(file)
      }
   }

   start = async (dir: string): Promise<void> => {
      const files = await scandir(dir)
      this.plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).map(file => [path.basename(file).replace('.js', ''), require(file)]))
   }

   scraper = async (dir: string): Promise<void> => {
      const files = await scandir(dir)
      this.scrapers = Object.fromEntries(files.filter(v => !v.endsWith('_.js')).map(file => [path.basename(file).replace('.js', ''), this.require(file)]))
   }
}

export default Loader