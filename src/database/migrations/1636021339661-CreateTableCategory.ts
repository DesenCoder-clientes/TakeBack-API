import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableCategory1636021339661 implements MigrationInterface {
    name = 'CreateTableCategory1636021339661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "categoryFee" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_c728426d7af44c50be89769c2bd" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_c728426d7af44c50be89769c2bd"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
