import { Request, Response, NextFunction } from 'express'

type Method = 'get' | 'post'

export interface Route {
	name?: string
	category: string
	path: string
	method: 'get' | 'post'
	execution: (req: Request, res: Response, next: NextFunction) => Promise<void>
	error?: boolean
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
	error: boolean
	premium?: boolean
}