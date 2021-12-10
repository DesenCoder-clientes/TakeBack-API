import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateTablePaymentMethods1639099298924 implements MigrationInterface {
    name = 'GenerateTablePaymentMethods1639099298924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid NOT NULL, "paymentMethodId" integer NOT NULL, "cashbackPercentage" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" ADD CONSTRAINT "FK_d167c7a5fa7e321ac698cbbc67d" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" ADD CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_payment_methods" DROP CONSTRAINT "FK_50140b197f6a47698d463b4b3aa"`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" DROP CONSTRAINT "FK_d167c7a5fa7e321ac698cbbc67d"`);
        await queryRunner.query(`DROP TABLE "company_payment_methods"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
