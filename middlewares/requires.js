export default (route) => {
   return (req, res, next) => {
      if (route.parameter && route.parameter.length > 0) {
         let check

         switch (route.method.toLowerCase()) {
            case 'get':
               check = global.validator.get(req, route.parameter)
               break
            case 'post':
            case 'put':
            case 'patch':
               check = global.validator.post(req, route.parameter)
               break
            case 'delete':
               check = global.validator.delete(req, route.parameter)
               break
            default:
               check = { status: true }
         }

         if (!check.status) {
            return res.status(400).json(check)
         }
      }

      const source = route.method === 'get' ? req.query : req.body

      if (route.parameter && route.parameter.length > 0) {
         for (const paramName of route.parameter) {
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
      }

      next()
   }
}