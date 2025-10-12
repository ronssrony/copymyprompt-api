import dataSource from './typeorm-cli.config';

export default {
  dataSource,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
};
