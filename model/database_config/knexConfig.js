

    module.exports = {
      development: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          user: 'root',
          password: 'bcd127',
          database: 'db_oroscorp',
          port: 3306,
          charset: 'utf8mb4'
        },
        migrations: { tableName: 'knex_migrations', directory: './db/migrations' },
        seeds: { directory: './db/seeds' }
      },
    
      production: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          charset: 'utf8mb4',
          ssl: { rejectUnauthorized: false } 
        },
        migrations: { tableName: 'knex_migrations', directory: './db/migrations' },
        seeds: { directory: './db/seeds' }
      }
};
