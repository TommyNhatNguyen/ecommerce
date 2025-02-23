import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
config();
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  minifyAliases: true,
  logging: console.log,
  // pool: {
  //   max: 20,
  //   min: 2,
  //   acquire: 30000,
  //   idle: 60000,
  // },
});
