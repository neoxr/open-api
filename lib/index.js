module.exports = class Component {
   Scraper = new(require('./system/scraper-classes'))
   Loader = new(require('./system/loader'))
   Fetcher = new(require('./system/fetcher'))
}