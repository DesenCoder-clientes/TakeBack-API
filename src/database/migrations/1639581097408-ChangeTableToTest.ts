import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTableToTest1639581097408 implements MigrationInterface {
    name = 'ChangeTableToTest1639581097408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" ADD "dateAt" date DEFAULT '"2021-12-15T15:11:37.559Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transactions" DROP COLUMN "dateAt"`);
    }

}
