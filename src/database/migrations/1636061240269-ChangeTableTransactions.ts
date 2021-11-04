import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTableTransactions1636061240269 implements MigrationInterface {
    name = 'ChangeTableTransactions1636061240269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP CONSTRAINT "FK_13d631f2ecfcdb7a41e3b7f8d7e"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_2f4241d38ec3ec108e94fc64b8c"`);
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "transactionsId"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "transactionsId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "consumerId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_54c69353a3e86a334aa41bacd38" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_c5c4bc0ef04ce5729481c60b559" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_c5c4bc0ef04ce5729481c60b559"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_54c69353a3e86a334aa41bacd38"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "consumerId"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "transactionsId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "transactionsId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_2f4241d38ec3ec108e94fc64b8c" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD CONSTRAINT "FK_13d631f2ecfcdb7a41e3b7f8d7e" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
