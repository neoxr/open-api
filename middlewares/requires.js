export default (route) => {
   return (req, res, next) => {
      const reqFn = route.method === 'get' ? 'reqGet' : 'reqPost'
      const check = global.status[reqFn](req, route.parameter)
   
      if (!check.status) return res.json(check)
   
      const reqType = route.method === 'get' ? 'query' : 'body'
      if ('url' in req[reqType]) {
         const isUrl = global.status.url(req[reqType].url)
         if (!isUrl.status) return res.json(isUrl)
      }
   
      next()
   }
}