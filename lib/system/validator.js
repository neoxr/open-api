/**
 * Core helper function to perform validation on a data source.
 * @param {object} source - The source object (e.g., req.body, req.query).
 * @param {string[]} params - An array of required parameter keys.
 * @param {string} location - The name of the location for the error message (e.g., 'body', 'query string', 'route parameters').
 * @returns {{status: boolean, msg?: string, creator?: string}} The validation result object.
 */
export default (source, params, location) => {
   if (!params || params.length === 0) {
      return { status: true }
   }

   const required = params.filter(key => !(key in source) || !source[key])

   if (required.length > 0) {
      const missingParams = required.length > 1
         ? `"${required.slice(0, -1).join('", "')}" and "${required.slice(-1)}"`
         : `"${required[0]}"`

      return {
         creator: global.creator,
         status: false,
         msg: `Parameter ${missingParams} is required in the request ${location}.`
      }
   }

   return { status: true }
}

