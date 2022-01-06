import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateTakeBackUsersTable1641471071007 implements MigrationInterface {
    name = 'GenerateTakeBackUsersTable1641471071007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "take_back_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "isRoot" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_764061e99182bd434106e00c341" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "take_back_users"`);
    }

}
