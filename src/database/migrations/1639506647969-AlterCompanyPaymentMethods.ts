import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterCompanyPaymentMethods1639506647969 implements MigrationInterface {
    name = 'AlterCompanyPaymentMethods1639506647969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "isActive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "isActive"`);
    }

}
