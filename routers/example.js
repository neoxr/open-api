import Tempo from '../lib/scraper/tempo.js'

export const routes = {
   category: 'main',
   path: '/api/tempo',
   parameter: ['q'],
   method: 'get',
   execution: async (req, res, next) => {
      const { q } = req.query
      const json = await Tempo.search(q)
      res.json(json)
   },
   error: false
}