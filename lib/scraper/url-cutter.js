module.exports = class Scraper extends require('../system/fetcher') {
   constructor() {
      super()
   }
   
   cut = url => new Promise(async resolve => {
      try {
         const json = await this._post('https://dr-api.encurtador.dev/encurtamentos', {
            url
         }, {
            headers: {
               origin: 'https://www.urlshort.dev',
               referer: 'https://www.urlshort.dev/',
               'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36'
            }
         })
         if (!json.urlEncurtada) return resolve({
            creator: global.creator,
            status: false,
            msg: `Sorry, we couldn't process your URL!`
         })
         resolve({
            creator: global.creator,
            status: true,
            data: {
               original: url,
               short_url: 'https://' + json.urlEncurtada
            }
         })
      } catch (e) {
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}