class Tempo {
   async search(q) {
      try {
         const json = await (await fetch('https://u2ciazrcad-dsn.algolia.net/1/indexes/production_articles/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.24.0)%3B%20Browser', {
            method: 'POST',
            body: JSON.stringify({
               query: q,
               filters: "NOT unpublished_at",
               hitsPerPage: 10,
               page: 0
            }),
            headers: {
               'origin': 'https://www.tempo.co',
               'referer': 'https://www.tempo.co/',
               'x-algolia-api-key': 'a74cdcfcc2c69b5dabb4d13c4ce52788',
               'x-algolia-application-id': 'U2CIAZRCAD'
            }
         })).json()
         if (json?.status === 403 || json?.hits?.length < 1) throw new Error(json.message)
         return {
            creator: global.creator,
            status: true,
            data: json.hits
         }
      } catch (e) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }
}

export default new Tempo