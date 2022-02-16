import {MigrationInterface, QueryRunner} from "typeorm";

export class AlteracaoNaTabelaCompany1645010281372 implements MigrationInterface {
    name = 'AlteracaoNaTabelaCompany1645010281372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "blockedBalance"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "positiveBalance" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "negativeBalance" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "negativeBalance"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "positiveBalance"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "blockedBalance" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "balance" double precision NOT NULL DEFAULT '0'`);
    }

}
