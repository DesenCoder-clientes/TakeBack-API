import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTable1647097947184 implements MigrationInterface {
    name = 'AlterTable1647097947184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "currentMonthlyPaymentPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "currentMonthlyPaymentPaid"`);
    }

}
