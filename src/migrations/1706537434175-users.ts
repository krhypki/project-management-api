import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

const users = [
  {
    email: 'tomasz@tomaszewski.pl',
    password: 'tomasz',
    firstName: 'Tomasz',
    lastName: 'Tomaszewski',
  },
  {
    email: 'jan@janowski.pl',
    password: 'jan',
    firstName: 'Jan',
    lastName: 'Janowski',
  },
  {
    email: 'adam@adamski.pl',
    password: 'adam',
    firstName: 'Adam',
    lastName: 'Adamski',
  },
  {
    email: 'piotr@piotrowski.pl',
    password: 'piotr',
    firstName: 'Piotr',
    lastName: 'Piotrowski',
  },
];

export class Users1706537434175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      users.map(async (user) => {
        await queryRunner.manager.save(
          queryRunner.manager.create<User>(User, {
            ...user,
            password: await bcrypt.hash(user.password, 10),
          }),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM user`);
  }
}
