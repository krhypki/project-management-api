import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerated1706615406931 implements MigrationInterface {
  name = 'AutoGenerated1706615406931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "ownerId" integer, CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "UQ_b58774a8460d69d09c888158ab1" UNIQUE ("code"), CONSTRAINT "REL_9884b2ee80eb70b7db4f12e8ae" UNIQUE ("ownerId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('Created'), "desc" varchar, "reporterId" integer, "assigneeId" integer, "projectId" integer, CONSTRAINT "UQ_ca4a3a0d8c19b661356df9a83e4" UNIQUE ("code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "ownerId" integer, CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "UQ_b58774a8460d69d09c888158ab1" UNIQUE ("code"), CONSTRAINT "REL_9884b2ee80eb70b7db4f12e8ae" UNIQUE ("ownerId"), CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_project"("id", "name", "code", "ownerId") SELECT "id", "name", "code", "ownerId" FROM "project"`,
    );
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_project" RENAME TO "project"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('Created'), "desc" varchar, "reporterId" integer, "assigneeId" integer, "projectId" integer, CONSTRAINT "UQ_ca4a3a0d8c19b661356df9a83e4" UNIQUE ("code"), CONSTRAINT "FK_d7263b567c2d0945fd5aa9ab671" FOREIGN KEY ("reporterId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_task"("id", "name", "code", "status", "desc", "reporterId", "assigneeId", "projectId") SELECT "id", "name", "code", "status", "desc", "reporterId", "assigneeId", "projectId" FROM "task"`,
    );
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
    await queryRunner.query(
      `CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('Created'), "desc" varchar, "reporterId" integer, "assigneeId" integer, "projectId" integer, CONSTRAINT "UQ_ca4a3a0d8c19b661356df9a83e4" UNIQUE ("code"))`,
    );
    await queryRunner.query(
      `INSERT INTO "task"("id", "name", "code", "status", "desc", "reporterId", "assigneeId", "projectId") SELECT "id", "name", "code", "status", "desc", "reporterId", "assigneeId", "projectId" FROM "temporary_task"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_task"`);
    await queryRunner.query(
      `ALTER TABLE "project" RENAME TO "temporary_project"`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "code" varchar NOT NULL, "ownerId" integer, CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "UQ_b58774a8460d69d09c888158ab1" UNIQUE ("code"), CONSTRAINT "REL_9884b2ee80eb70b7db4f12e8ae" UNIQUE ("ownerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "project"("id", "name", "code", "ownerId") SELECT "id", "name", "code", "ownerId" FROM "temporary_project"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_project"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}