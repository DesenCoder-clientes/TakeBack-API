import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedTablePaymentOrder1644851023171 implements MigrationInterface {
    name = 'CreatedTablePaymentOrder1644851023171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_order_status" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7e518a8c66fd35e7cb7b97ffb21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_order" ("id" SERIAL NOT NULL, "value" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "statusId" integer, "companyId" uuid, CONSTRAINT "PK_f5221735ace059250daac9d9803" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "paymentOrderId" integer`);
        await queryRunner.query(`ALTER TABLE "payment_order" ADD CONSTRAINT "FK_a811f3c6bb72979493ec8958865" FOREIGN KEY ("statusId") REFERENCES "payment_order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_order" ADD CONSTRAINT "FK_a1a1ef3a6ed218fac0bf633a6ae" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD CONSTRAINT "FK_3eeb502d7c7f5b94e88d02bfb55" FOREIGN KEY ("paymentOrderId") REFERENCES "payment_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_3eeb502d7c7f5b94e88d02bfb55"`);
        await queryRunner.query(`ALTER TABLE "payment_order" DROP CONSTRAINT "FK_a1a1ef3a6ed218fac0bf633a6ae"`);
        await queryRunner.query(`ALTER TABLE "payment_order" DROP CONSTRAINT "FK_a811f3c6bb72979493ec8958865"`);
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "paymentOrderId"`);
        await queryRunner.query(`DROP TABLE "payment_order"`);
        await queryRunner.query(`DROP TABLE "payment_order_status"`);
    }

}
