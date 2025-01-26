## OPEN-API

> JavaScript (ESM) base website script using a plugin as a router that is lightweight and easy to customize.

<p align="center"><img src="https://qu.ax/zhNAn.png" alt="Open-API" width="100%"></p>

### Features

- [x] Plugin as Router
- [x] Auto List Feature
- [x] High Optimation
- [x] Easy to Customize
- [x] Show User IP
- [x] Restrict Access (IP Whitelist)
- [x] Request Per Minute Limit
- [x] Suitable for Rest API
- [x] etc.

### Router

> This is an example of a router

```Javascript
import { Loader } from '../lib/index.js'
const Scraper = Loader.scrapers

export const routes = {
   category: 'main',
   path: '/api/tempo',
   parameter: ['q'],
   method: 'get',
   execution: async (req, res, next) => {
      const { q } = req.query
      const json = await Scraper.tempo.search(q)
      res.json(json)
   },
   error: false,
   authorize: false,
   rpm: false,
   restrict: false
}
```

### Installation & Run

```
$ yarn
$ node .
```

or want to use pm2

```
$ yarn
$ npm i -g pm2
$ pm2 start pm2.cjs && pm2 logs
```

### Example

> /api/tempo?q={query}

### Conclusion

> Open-API is part of [Neoxr API](https://api.neoxr.my.id)