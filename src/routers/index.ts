import { Route } from '../lib/Utils/types'
import { Request, Response, NextFunction } from 'express'

export const routes: Route = {
   category: 'main',
   path: '/',
   method: 'get',
   execution: async (req: Request, res: Response, next: NextFunction) => {
      res.json({
         creator: global.creator,
         status: true,
         msg: 'Hello World ^_^'
      })
   },
   error: false,
   rpm: true
}