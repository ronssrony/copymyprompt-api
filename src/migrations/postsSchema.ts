import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class PostsSchema1758475550000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // CATEGORIES
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    // POSTS
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar', length: '255', isNullable: true },
          { name: 'prompt', type: 'text', isNullable: false },
          { name: 'image', type: 'text', isNullable: false },
          {
            name: 'price',
            type: 'numeric',
            precision: 10,
            scale: 2,
            default: 0,
          },
          { name: 'model', type: 'varchar', length: '100', isNullable: true },
          { name: 'categoryId', type: 'int', isNullable: true }, // 👈 camelCase
          { name: 'userId', type: 'int', isNullable: true }, // 👈 camelCase
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKeys('posts', [
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    // LIKES
    await queryRunner.createTable(
      new Table({
        name: 'post_likes',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'postId', type: 'int', isNullable: false }, // 👈 camelCase
          { name: 'userId', type: 'int', isNullable: false }, // 👈 camelCase
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
        uniques: [new TableUnique({ columnNames: ['postId', 'userId'] })],
      }),
    );
    await queryRunner.createForeignKeys('post_likes', [
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    // SHARES
    await queryRunner.createTable(
      new Table({
        name: 'post_shares',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'postId', type: 'int', isNullable: false }, // 👈
          { name: 'userId', type: 'int', isNullable: false }, // 👈
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
        uniques: [new TableUnique({ columnNames: ['postId', 'userId'] })],
      }),
    );
    await queryRunner.createForeignKeys('post_shares', [
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    // COPIES
    await queryRunner.createTable(
      new Table({
        name: 'post_copies',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'postId', type: 'int', isNullable: false }, // 👈
          { name: 'userId', type: 'int', isNullable: false }, // 👈
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
        uniques: [new TableUnique({ columnNames: ['postId', 'userId'] })],
      }),
    );
    await queryRunner.createForeignKeys('post_copies', [
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    // RATINGS
    await queryRunner.createTable(
      new Table({
        name: 'post_ratings',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'postId', type: 'int', isNullable: false }, // 👈
          { name: 'userId', type: 'int', isNullable: false }, // 👈
          { name: 'value', type: 'int', isNullable: false },
          { name: 'body', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
        uniques: [new TableUnique({ columnNames: ['postId', 'userId'] })],
      }),
    );
    await queryRunner.createForeignKeys('post_ratings', [
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('post_ratings');
    await queryRunner.dropTable('post_copies');
    await queryRunner.dropTable('post_shares');
    await queryRunner.dropTable('post_likes');
    await queryRunner.dropTable('posts');
    await queryRunner.dropTable('categories');
  }
}
