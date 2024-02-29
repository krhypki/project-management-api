import { Project } from 'src/entities/project.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const marketingTasks = [
  {
    name: 'Task number 1',
    desc: 'Task number 1 desc',
    assignee: 'tomasz@tomaszewski.pl',
    reporter: 'adam@adamski.pl',
    code: 'MK1',
  },
  {
    name: 'Task number 2',
    desc: 'Task number 2 desc',
    assignee: 'piotr@piotrowski.pl',
    reporter: 'adam@adamski.pl',
    code: 'MK2',
  },
  {
    name: 'Task number 3',
    desc: 'Task number 3 desc',
    assignee: 'tomasz@tomaszewski.pl',
    reporter: 'jan@janowski.pl',
    code: 'MK3',
  },
  {
    name: 'Task number 4',
    desc: 'Task number 4 desc',
    assignee: 'jan@janowski.pl',
    reporter: 'tomasz@tomaszewski.pl',
    code: 'MK4',
  },
];
export class Tasks1709209493108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepo = queryRunner.manager.getRepository(User);
    const projectRepo = queryRunner.manager.getRepository(Project);

    await Promise.all(
      marketingTasks.map(async (task) => {
        const assignee = await usersRepo.findOne({
          where: { email: task.assignee },
        });

        const reporter = await usersRepo.findOne({
          where: { email: task.reporter },
        });

        const project = await projectRepo.findOne({
          where: { code: 'MK' },
        });

        await queryRunner.manager.save(
          queryRunner.manager.create<Task>(Task, {
            ...task,
            assignee,
            reporter,
            project,
          }),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM project`);
  }
}
