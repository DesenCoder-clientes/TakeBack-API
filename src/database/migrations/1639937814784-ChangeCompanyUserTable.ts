import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeCompanyUserTable1639937814784 implements MigrationInterface {
    name = 'ChangeCompanyUserTable1639937814784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" RENAME COLUMN "email" TO "isRootUser"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "isRootUser"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "isRootUser" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "isRootUser"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "isRootUser" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" RENAME COLUMN "isRootUser" TO "email"`);
    }

}
