import { Request, Response, NextFunction } from 'express'

export type Role = 'user' | 'admin' | 'banned'

export interface User {
   id: number
   username: string
   password: string
   limit: number
   role: string
   premium: boolean
   expired_at: number
   created_at: number
}

export interface Response {
   creator: string
   status: boolean
   data?: User
   msg?: string
}

export type Method = 'get' | 'post'

export interface Minddleware {
   restrict?: boolean
   authorize?: boolean
   rpm?: boolean
   error?: boolean
   requires?: ((req: Request, res: Response, next: NextFunction) => void) | false
   validator?: (req: Request, res: Response, next: NextFunction) => void
   method: Method
   parameter?: string[]
   [key: string]: any
}

export interface Route {
   name?: string
   category: string
   path: string
   parameter?: string[]
   method: Method
   execution: (req: Request, res: Response, next: NextFunction) => Promise<void>
   error?: boolean | undefined
   example?: any
   premium?: boolean
   rpm?: boolean
   restrict?: boolean
   authorize?: boolean
}

export interface Collection {
   category?: string
   base_code: string
   name?: string
   path: string
   method: Method
   raw?: {
      path?: string,
      example?: string | null
   }
   error: boolean | undefined
   premium?: boolean
}