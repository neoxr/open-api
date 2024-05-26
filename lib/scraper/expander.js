const { _direct } = new(require('../system/fetcher'))

module.exports = url => new Promise(async resolve => {
   try {
      const result = await _direct(url)
      if (!result) return resolve({
         creator: global.creator,
         status: false,
         msg: `Sorry, we couldn't process your URL!`
      })
      resolve({
         creator: global.creator,
         status: true,
         data: {
            original: url,
            expand_url: result
         }
      })
   } catch (e) {
      resolve({
         creator: global.creator,
         status: false,
         msg: e.message
      })
   }
})