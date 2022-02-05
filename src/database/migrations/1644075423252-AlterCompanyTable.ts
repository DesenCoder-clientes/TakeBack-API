import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterCompanyTable1644075423252 implements MigrationInterface {
    name = 'AlterCompanyTable1644075423252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "cashbackPercentDefault"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "customIndustryFee" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "customIndustryFeeActive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "customIndustryFeeActive"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "customIndustryFee"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "cashbackPercentDefault" double precision NOT NULL DEFAULT '0'`);
    }

}
