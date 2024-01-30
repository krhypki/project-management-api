import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/entities/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
};

export default config;
