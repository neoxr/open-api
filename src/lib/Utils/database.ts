import Database from 'better-sqlite3'
import { Role, Response } from './types'

class Sqlite {
   private db: any

   constructor(data: string = 'database', options: any = {}) {
      this.db = new Database(data + '.db', options)
      this.init()
   }

   init = (): void => {
      const createTableQuery = `
         CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            "limit" INTEGER DEFAULT 10,
            role TEXT DEFAULT 'user',
            premium INTEGER DEFAULT 0,
            expired_at INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
         )
      `
      this.db.prepare(createTableQuery).run()
   }

   account = (username: string): Response => {
      try {
         const query = `SELECT username, "limit", role, premium, expired_at, created_at FROM users WHERE username = ?`
         const data = this.db.prepare(query).get(username)
         if (!data) throw new Error('User not found')
         return {
            creator: global.creator,
            status: true,
            data
         }
      } catch (e: any) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }

   insert = (username: string, password: string): Response => {
      try {
         const json = this.account(username)
         if (json?.status) throw new Error('Account already exists')
         const query = `INSERT INTO users (username, password, "limit", role, premium, expired_at) VALUES (?, ?, ?, ?, ?, ?)`

         // Define default values
         const limit: number = 10
         const role: Role = ['admin', 'neoxr'].includes(username) ? 'admin' : 'user'
         const premium: number = 0
         const expired_at: number = 0

         this.db.prepare(query).run(username, password, limit, role, premium, expired_at)
         return {
            creator: global.creator,
            status: true,
            msg: 'Registration successful'
         }
      } catch (e: any) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }
}

export default Sqlite