import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTableUserTypes1638879084102 implements MigrationInterface {
    name = 'ChangeTableUserTypes1638879084102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" ADD "isManager" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" DROP COLUMN "isManager"`);
    }

}
