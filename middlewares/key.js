export default (req, res, next) => {
   const { apikey } = req.query
   if (!apikey)
      return res.status(401).json({
         creator: global.creator,
         status: false,
         msg: 'Unauthorized'
      })

   if (apikey != 'neoxr')
      return res.status(403).json({
         creator: global.creator,
         status: false,
         msg: 'Invalid apikey'
      })

   next()
}