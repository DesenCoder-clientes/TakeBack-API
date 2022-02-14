import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTable1644845698156 implements MigrationInterface {
    name = 'AlterTable1644845698156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."industries" DROP COLUMN "iconCategory"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."industries" ADD "iconCategory" integer NOT NULL DEFAULT '1'`);
    }

}
