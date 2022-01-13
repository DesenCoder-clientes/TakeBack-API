import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTables1642092408969 implements MigrationInterface {
    name = 'AlterTables1642092408969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "FK_85a2acb09fe04ec07518337d24c"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP COLUMN "companyPaymentMethodId"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" DROP CONSTRAINT "FK_50140b197f6a47698d463b4b3aa"`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD "companyPaymentMethodId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."company_payment_methods" ADD CONSTRAINT "FK_85a2acb09fe04ec07518337d24c" FOREIGN KEY ("companyPaymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
