import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewColumn1647007849226 implements MigrationInterface {
    name = 'AddNewColumn1647007849226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" ADD "isPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_monthly_payment" DROP COLUMN "isPaid"`);
    }

}
