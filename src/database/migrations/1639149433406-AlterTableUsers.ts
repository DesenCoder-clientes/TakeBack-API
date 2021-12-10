import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableUsers1639149433406 implements MigrationInterface {
    name = 'AlterTableUsers1639149433406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "email"`);
    }

}
