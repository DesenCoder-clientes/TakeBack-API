import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableTransactions1639828259613 implements MigrationInterface {
    name = 'AlterTableTransactions1639828259613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "transactionNumber" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "aprovedAt" date`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ALTER COLUMN "dateAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" ALTER COLUMN "dateAt" SET DEFAULT '2021-12-16'`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "aprovedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "transactionNumber"`);
    }

}
