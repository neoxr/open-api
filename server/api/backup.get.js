import { getCloudflareEnv, jsonResponse, escapeSqlValue } from '../utils/index.js'
import appConfig from '../utils/app-config.js'

export const properties = {
   name: 'Backup Database',
   error: false
}

export default defineApi({
   properties,
   exwcution: async (event) => {
      const env = getCloudflareEnv(event)
      const query = getQuery(event)
      const db = env?.DB

      const secret = query.secret
      const expectedSecret = env?.CRON_SECRET || env?.ADMIN_SECRET || env?.SECRET

      if (!expectedSecret || secret !== expectedSecret)
         return jsonResponse(event, {
            creator: appConfig.watermark.creator,
            status: false,
            msg: 'Unauthorized: Invalid secret token'
         }, 401)

      if (!db)
         return jsonResponse(event, {
            creator: appConfig.watermark.creator,
            status: false,
            msg: 'Database D1 binding not found'
         }, 500)

      try {
         const now = new Date()
         const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
         const fileName = `d1_backup_${dateStr}.sql`

         let sqlDump = ''

         const { results: schemaResults } = await db.prepare(
            `SELECT type, name, sql FROM sqlite_master WHERE type IN ('table', 'index', 'trigger') AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY type DESC, name ASC`
         ).all()

         const tables = (schemaResults || []).filter(item => item.type === 'table')

         for (const table of tables) {
            if (table.sql) {
               let createSql = table.sql.trim()
               if (!createSql.includes('IF NOT EXISTS')) {
                  createSql = createSql.replace(/^CREATE TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS ')
               }
               sqlDump += `${createSql};\n`
            }

            const { results: rows } = await db.prepare(`SELECT * FROM "${table.name}"`).all()

            if (rows && rows.length > 0) {
               const cols = Object.keys(rows[0]).map(c => `"${c}"`).join(', ')
               for (const row of rows) {
                  const vals = Object.values(row).map(escapeSqlValue).join(', ')
                  sqlDump += `INSERT OR REPLACE INTO "${table.name}" (${cols}) VALUES (${vals});\n`
               }
            }
            sqlDump += `\n`
         }

         const otherSchema = (schemaResults || []).filter(item => item.type !== 'table')
         if (otherSchema.length > 0) {
            for (const item of otherSchema) {
               if (item.sql) {
                  let createSql = item.sql.trim()
                  if (item.type === 'index' && !createSql.includes('IF NOT EXISTS')) {
                     createSql = createSql.replace(/^CREATE INDEX\s+/i, 'CREATE INDEX IF NOT EXISTS ')
                  }
                  sqlDump += `${createSql};\n`
               }
            }
            sqlDump += `\n`
         }

         setHeader(event, 'Content-Type', 'text/x-sql; charset=utf-8')
         setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`)
         setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')

         return sqlDump
      } catch (err) {
         return jsonResponse(event, {
            creator: appConfig.watermark.creator,
            status: false,
            msg: '`Backup failed: ${err.message}'
         }, 500)
      }
   }
})