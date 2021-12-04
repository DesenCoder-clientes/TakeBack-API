import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeCompanyColumn1638622620540 implements MigrationInterface {
    name = 'ChangeCompanyColumn1638622620540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_c728426d7af44c50be89769c2bd"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" RENAME COLUMN "categoryId" TO "industryId"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_d10b3310c1016d05c123fdd08e1" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."companies" DROP CONSTRAINT "FK_d10b3310c1016d05c123fdd08e1"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" RENAME COLUMN "industryId" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "public"."companies" ADD CONSTRAINT "FK_c728426d7af44c50be89769c2bd" FOREIGN KEY ("categoryId") REFERENCES "industries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
