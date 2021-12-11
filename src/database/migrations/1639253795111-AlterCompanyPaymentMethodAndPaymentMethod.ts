import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterCompanyPaymentMethodAndPaymentMethod1639253795111 implements MigrationInterface {
    name = 'AlterCompanyPaymentMethodAndPaymentMethod1639253795111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "FK_50140b197f6a47698d463b4b3aa"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "paymentMethodId"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "paymentMethodId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "FK_50140b197f6a47698d463b4b3aa"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "paymentMethodId"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "paymentMethodId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
