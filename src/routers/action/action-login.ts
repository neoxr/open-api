import { Route } from '../../lib/Utils/types'
import { Request, Response, NextFunction } from 'express'
import md5 from 'md5'

export const routes: Route = {
   category: 'action',
   path: '/action/login',
   parameter: ['username', 'password'],
   method: 'post',
   execution: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { username, password } = req.body
         const json = global.db.account(username)
         if (!json.status) return res.status(404).json(json.msg) 
         if (json?.data?.password != md5(password)) throw new Error('Incorrect password')

      } catch (e: any) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   },
   error: false,
   rpm: true
}