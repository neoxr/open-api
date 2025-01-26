import axios from 'axios'
import cheerio from 'cheerio'

class Tempo {
   async search(q) {
      try {
         const html = await (await axios.get(`https://www.tempo.co/search?q=${encodeURIComponent(q)}`)).data
         const $ = cheerio.load(html)
         const data = []
         $('div[class="card-box ft240 margin-bottom-sm"]').each((i, e) => data.push({
            title: $(e).find('h2.title').text().trim(),
            snippet: $(e).find('p').text().trim(),
            posted: $(e).find('h4.date').text().replace('TEMPO.CO', '').trim(),
            url: $(e).find('a').attr('href'),
         }))
         if (data.length < 1) return {
            creator: global.creator,
            status: false,
            msg: 'Result not found'
         }
         return {
            creator: global.creator,
            status: true,
            data
         }
      } catch (e) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }
}

export default new Tempo