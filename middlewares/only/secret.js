export default (req, res, next) => {
   const isGet = req.method?.toLowerCase() === 'get'
   const validatorFn = isGet ? global.validator.get : global.validator.post
   const source = isGet ? req.query : req.body

   const check = validatorFn(req, ['secret'])
   if (!check.status) {
      return res.status(400).json(check)
   }

   for (const paramName in source) {
      if (paramName === 'secret') continue

      const value = source[paramName]
      if (value) {
         let formatCheck = { status: true }

         if (paramName === 'url') {
            formatCheck = global.validator.url(value)
         } else if (paramName === 'number') {
            formatCheck = global.validator.number(value)
         }

         if (!formatCheck.status) {
            formatCheck.msg = `Parameter "${paramName}" has an invalid format. (${formatCheck.msg})`
            return res.status(400).json(formatCheck)
         }
      }
   }

   const secret = source.secret
   console.log(secret)
   if (secret !== process.env.SITE_SECRET_KEY) {
      return res.status(403).json({
         creator: global.creator,
         status: false,
         msg: 'Invalid secret key'
      })
   }

   next()
}