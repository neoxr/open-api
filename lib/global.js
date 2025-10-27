import 'dotenv/config'
import _validate from './system/validator.js'

global.creator = `@neoxr.js – Wildan Izzudin`

global.validator = {
   get: (req, params) => {
      return _validate(req.query, params, 'query string')
   },
   post: (req, params) => {
      return _validate(req.body, params, 'body')
   },
   params: (req, params) => {
      return _validate(req.params, params, 'route parameters')
   },
   delete: (req, params) => {
      let validationResult = _validate(req.params, params, 'route parameters')
      if (params.every(p => p in req.params)) return validationResult

      validationResult = _validate(req.query, params, 'query string')
      if (params.every(p => p in req.query)) return validationResult

      return _validate(req.body, params, 'body')
   },
   all: (req, rules) => {
      const locations = ['body', 'query', 'params']
      const errors = []

      for (const location of locations) {
         if (rules[location] && rules[location].length > 0) {
            const result = _validate(
               req[location],
               rules[location],
               location === 'query' ? 'query string' : (location === 'params' ? 'route parameters' : 'body')
            )

            if (!result.status) {
               errors.push(result.msg)
            }
         }
      }

      if (errors.length > 0) {
         return {
            creator: global.creator,
            status: false,
            msg: errors.join(' ')
         }
      }

      return { status: true }
   },
   url: (input) => {
      if (!input) {
         return {
            creator: global.creator,
            status: false,
            msg: 'Input value cannot be empty.'
         }
      }
      try {
         new URL(input)
         return { status: true }
      } catch (error) {
         return {
            creator: global.creator,
            status: false,
            msg: `The value "${input}" is not a valid URL.`
         }
      }
   },
   number: (input) => {
      if (input === null || input === undefined || String(input).trim() === '') {
         return {
            creator: global.creator,
            status: false,
            msg: 'Input value cannot be empty and must be a number.'
         }
      }
      if (!isFinite(input)) {
         return {
            creator: global.creator,
            status: false,
            msg: `The value "${input}" must be a valid number.`
         }
      }
      return { status: true }
   }
}