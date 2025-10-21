import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class UserFollowsSchema1758480000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to users table
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'bio',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'followingCount',
        type: 'int',
        default: 0,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'followersCount',
        type: 'int',
        default: 0,
      }),
    );

    // Create user_follows table
    await queryRunner.createTable(
      new Table({
        name: 'user_follows',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'followerId', type: 'int', isNullable: false }, // User who is following
          { name: 'followingId', type: 'int', isNullable: false }, // User being followed
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
        uniques: [
          new TableUnique({ columnNames: ['followerId', 'followingId'] }),
        ],
      }),
    );

    await queryRunner.createForeignKeys('user_follows', [
      new TableForeignKey({
        columnNames: ['followerId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['followingId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop user_follows table
    await queryRunner.dropTable('user_follows');

    // Remove columns from users table
    await queryRunner.dropColumn('users', 'followersCount');
    await queryRunner.dropColumn('users', 'followingCount');
    await queryRunner.dropColumn('users', 'bio');
  }
}
