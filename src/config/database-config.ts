import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/entities/*.entity.js'],
  synchronize: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
};

export default config;
