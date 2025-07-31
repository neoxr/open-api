export default (route) => {
   return (req, res, next) => {
      const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
      const check = global.status[reqFn](req, [...(route.parameter || []), 'apikey'])
      if (!check.status) return res.json(check)

      const reqType = reqFn === 'reqGet' ? 'query' : 'body'
      const apikey = req[reqType]?.apikey

      if (apikey != 'neoxr') // apikey=neoxr
         return res.status(403).json({
            creator: global.creator,
            status: false,
            msg: 'Invalid apikey'
         })

      next()
   }
}