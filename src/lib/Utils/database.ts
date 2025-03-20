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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0
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

   // Soft delete (mark user as deleted)
   softDelete = (username: string, status: 1 | 0 = 1): Response => {
      try {
         const query = `UPDATE users SET deleted = ? WHERE username = ? AND deleted = 0`
         const result = this.db.prepare(query).run(status, username)
         if (result.changes === 0) throw new Error('User not found or already deleted')

         return {
            creator: global.creator,
            status: true,
            msg: 'User soft deleted successfully'
         }
      } catch (e: any) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }

   // Delete method (permanent removal)
   delete = (username: string): Response => {
      try {
         const query = `DELETE FROM users WHERE username = ?`
         const result = this.db.prepare(query).run(username)
         if (result.changes === 0) throw new Error('User not found')

         return {
            creator: global.creator,
            status: true,
            msg: 'User deleted successfully'
         }
      } catch (e: any) {
         return {
            creator: global.creator,
            status: false,
            msg: e.message
         }
      }
   }

   // Update method (change user details)
   update = (username: string, newPassword: string, newRole: Role): Response => {
      try {
         const query = `UPDATE users SET password = ?, role = ? WHERE username = ?`
         const result = this.db.prepare(query).run(newPassword, newRole, username)
         if (result.changes === 0) throw new Error('User not found')

         return {
            creator: global.creator,
            status: true,
            msg: 'User updated successfully'
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