import jwt from 'jsonwebtoken'

export default (req, res, next) => {
   const authHeader = req.headers['authorization']
   const authToken = authHeader?.split(' ')[1]?.trim()

   if (!authToken || authToken !== req.session?.token) {
      return res.status(401).json({
         creator: global.creator,
         status: false,
         msg: 'Unauthorized'
      })
   }

   jwt.verify(authToken, process.env.JWT_SECRET, (err) => {
      if (err) {
         return res.status(403).json({
            creator: global.creator,
            status: false,
            msg: 'Forbidden access'
         })
      }
      next()
   })
}