// import { Function as Func } from '../lib/index'

export const routes = {
   category: 'open-api',
   path: '/convert',
   parameter: ['url'],
   method: 'get',
   execution: async (req, res, next) => {
      const { url } = req.query
      // const token = Func.genTokenFromUrl(url)
      const token = '12'
      res.json({
         creator: global.creator,
         status: true,
         data: {
            origin: req.body.url,
            url: `${req.protocol + 's://' + req.get('Host')}/file/${token}`
         }
      })
   },
   error: false
}