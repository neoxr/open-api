export const routes = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const json = await (await fetch('http://ip-api.com/json')).json()
         res.json({
            creator: global.creator,
            status: true,
            data: json
         })
      } catch (e) {
         res.json({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   },
   error: false
}