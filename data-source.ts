import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'mysql',
  database: 'mysql',
  migrations: ['./migrations/*.ts'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
