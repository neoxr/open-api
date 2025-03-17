import { Request, Response, NextFunction } from 'express'

interface Route {
	category: string
	path: string
	method: 'get' | 'post' | 'put' | 'delete'
	execution: (req: Request, res: Response, next: NextFunction) => Promise<void>
	error: boolean
}

const routes: Route = {
	category: 'main',
	path: '/',
	method: 'get',
	execution: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		res.json({
			creator: global.creator,
			status: true,
			msg: 'Hello World ^_^'
		})
	},
	error: false
}

export { routes }