import key from '../../middlewares/key.js'

export const routes = {
   category: 'main',
   path: '/api/test',
   method: 'get',
   middleware: [key],
   execution: async (req, res, next) => {
      res.send('Access Granted!')
   },
   error: false,
   rpm: true
}