import secret from '../../middlewares/only/secret.js'

export const routes = {
   category: 'main',
   path: '/api/test',
   method: 'get',
   middleware: [secret],
   execution: async (req, res, next) => {
      res.send('Access Granted!')
   },
   error: false,
   rpm: true
}