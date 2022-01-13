import {MigrationInterface, QueryRunner} from "typeorm";

export class NewRelationsStatusCompany1641991782601 implements MigrationInterface {
    name = 'NewRelationsStatusCompany1641991782601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP CONSTRAINT "FK_645ff37871e8c12622d49b1bbc1"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_54c69353a3e86a334aa41bacd38"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_c5c4bc0ef04ce5729481c60b559"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_62b21ed290ac956f6695f09c7a0"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "consumerId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companyUserId"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD "transactionsId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "consumersId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companiesId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companyUsersId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD "transactionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD CONSTRAINT "FK_03ae65f4f819fed4d1837622348" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_41a5467545419633ec789204e91" FOREIGN KEY ("consumersId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_6353b5ceb4106452422b5dc0d33" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_349047f9afb490b3e4f5f0ee761" FOREIGN KEY ("companyUsersId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_349047f9afb490b3e4f5f0ee761"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_6353b5ceb4106452422b5dc0d33"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_41a5467545419633ec789204e91"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP CONSTRAINT "FK_03ae65f4f819fed4d1837622348"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD "transactionId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companyUsersId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "companiesId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "consumersId"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP COLUMN "transactionsId"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companyUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "consumerId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_62b21ed290ac956f6695f09c7a0" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_c5c4bc0ef04ce5729481c60b559" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_54c69353a3e86a334aa41bacd38" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD CONSTRAINT "FK_645ff37871e8c12622d49b1bbc1" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
