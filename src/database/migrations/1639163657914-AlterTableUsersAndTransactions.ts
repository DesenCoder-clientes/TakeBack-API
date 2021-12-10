import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableUsersAndTransactions1639163657914 implements MigrationInterface {
    name = 'AlterTableUsersAndTransactions1639163657914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companyUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_62b21ed290ac956f6695f09c7a0" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_62b21ed290ac956f6695f09c7a0"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companyUserId"`);
    }

}
