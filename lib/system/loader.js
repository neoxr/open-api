const fs = require('node:fs')
const path = require('node:path')
const promisify = require('node:util').promisify
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const resolve = require('node:path').resolve

const scandir = async (dir) => {
   let subdirs = await readdir(dir)
   let files = await Promise.all(subdirs.map(async (subdir) => {
      let res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? scandir(res): res
   }))
   return files.reduce((a, f) => a.concat(f), [])
}

module.exports = class Loader {
   constructor() {
      this.plugins = []
   }
   
   start = async () => {
      const files = await scandir(`./plugins`)
      this.plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).map(file => [path.basename(file).replace('.js', ''), require(file)]))
      // this.commands = Func.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.usage))).map(v => v.run.usage)).concat(Func.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.hidden))).map(v => v.run.hidden)))
   }
}

