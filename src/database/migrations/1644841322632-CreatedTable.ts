import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedTable1644841322632 implements MigrationInterface {
    name = 'CreatedTable1644841322632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_plans" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "value" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f05aee900e96c2e0c24df48262" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "paymentPlanId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_0d4ef1a2673e3fc3b1934baaea5" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_0d4ef1a2673e3fc3b1934baaea5"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "paymentPlanId"`);
        await queryRunner.query(`DROP TABLE "payment_plans"`);
    }

}
