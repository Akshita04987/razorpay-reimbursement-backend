require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'postgres',
    host: process.env.DB_HOST || 'db.waqxdurepckmdxvrijny.supabase.co',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST || 'postgres_test',
    host: process.env.DB_HOST || 'db.waqxdurepckmdxvrijny.supabase.co',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'postgres',
    host: process.env.DB_HOST || 'db.waqxdurepckmdxvrijny.supabase.co',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
