import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewColumns1646238295748 implements MigrationInterface {
    name = 'AddNewColumns1646238295748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD "ticketName" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD "ticketPath" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD "pixKey" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."company_status" ALTER COLUMN "generateCashback" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_status" ALTER COLUMN "generateCashback" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP COLUMN "pixKey"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP COLUMN "ticketPath"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP COLUMN "ticketName"`);
    }

}
