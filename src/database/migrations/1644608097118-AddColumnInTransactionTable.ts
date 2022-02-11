import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnInTransactionTable1644608097118 implements MigrationInterface {
    name = 'AddColumnInTransactionTable1644608097118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "salesFee"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "takebackFeePercent" double precision`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "takebackFeeAmount" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "takebackFeeAmount"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "takebackFeePercent"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "salesFee" double precision`);
    }

}
