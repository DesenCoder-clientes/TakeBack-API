import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedTablePaymentMethodForPaymentOrder1644936700279 implements MigrationInterface {
    name = 'CreatedTablePaymentMethodForPaymentOrder1644936700279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_method_of_payment_order" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb8593ef1d6019b869047a1abe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD "paymentMethodId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD CONSTRAINT "FK_8ca8abb331dc065d7100126aa0f" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method_of_payment_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP CONSTRAINT "FK_8ca8abb331dc065d7100126aa0f"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP COLUMN "paymentMethodId"`);
        await queryRunner.query(`DROP TABLE "payment_method_of_payment_order"`);
    }

}
