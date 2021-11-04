import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTableToIconName1636030653701 implements MigrationInterface {
    name = 'ChangeTableToIconName1636030653701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."categories" ADD "iconCategory" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."categories" DROP COLUMN "iconCategory"`);
    }

}
