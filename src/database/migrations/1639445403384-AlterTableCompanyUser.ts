import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableCompanyUser1639445403384 implements MigrationInterface {
    name = 'AlterTableCompanyUser1639445403384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "isActive"`);
    }

}
