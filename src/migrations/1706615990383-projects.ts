import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

const projects = [
  {
    name: 'Marketing',
    code: 'MK',
    owner: 'piotr@piotrowski.pl',
  },
  {
    name: 'Security',
    code: 'SC',
    owner: 'adam@adamski.pl',
  },
  {
    name: 'UX',
    code: 'UX',
    owner: 'tomasz@tomaszewski.pl',
  },
  {
    name: 'Development',
    code: 'DEV',
    owner: 'jan@janowski.pl',
  },
];

export class Projects1706615990383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepo = queryRunner.manager.getRepository(User);

    await Promise.all(
      projects.map(async (project) => {
        const owner = await usersRepo.findOne({
          where: { email: project.owner },
        });

        await queryRunner.manager.save(
          queryRunner.manager.create<Project>(Project, {
            ...project,
            owner,
          }),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM project`);
  }
}
