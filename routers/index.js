exports.routes = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req, res, next) => {
      res.render(process.cwd() + '/public/index', {
         data: {
            title: process.env.SITENAME,
            description: 'Hi, this is me!'
         }
      })
   },
   error: false
}