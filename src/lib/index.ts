export { default as Loader } from './system/loader'
export { default as Fetcher } from './system/fetcher'
export { default as Function } from './system/functions'

import { Request, Response, NextFunction } from 'express'

export interface Route {
   name?: string
   category: string
   path: string
   method: 'get' | 'post'
   execution: (req: Request, res: Response, next: NextFunction) => Promise<void>
   error?: boolean
}