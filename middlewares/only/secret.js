export default (req, res, next) => {
   const reqFn = req.method?.toLowerCase() === 'get' ? 'reqGet' : 'reqPost'

   const check = global.status[reqFn](req, ['secret']) // <-- 'secret' parameter
   if (!check.status) return res.json(check)

   const reqType = reqFn === 'reqGet' ? 'query' : 'body'
   const secret = req[reqType]?.secret

   if (secret != '12345') // secret=12345
      return res.status(403).json({
         creator: global.creator,
         status: false,
         msg: 'Invalid secret'
      })

   next()
}