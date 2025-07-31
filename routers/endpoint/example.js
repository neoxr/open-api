import { Loader } from '../../lib/index.js'
const Scraper = Loader.scrapers

export const routes = {
   category: 'main',
   path: '/api/tempo',
   parameter: ['q'],
   method: 'get',
   execution: async (req, res, next) => {
      const { q } = req.query
      const json = await Scraper.tempo.search(q)
      res.json(json)
   },
   error: false,
   rpm: true,
   premium: true
}