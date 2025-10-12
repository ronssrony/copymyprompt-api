import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Category);
    await repo.insert([
      { name: 'Technology' },
      { name: 'Science' },
      { name: 'Art' },
      { name: 'Business' },
      { name: 'Health' },
    ]);
  }
}
