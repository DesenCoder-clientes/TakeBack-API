import {MigrationInterface, QueryRunner} from "typeorm";

export class DeactivateAccountCollumn1635880723253 implements MigrationInterface {
    name = 'DeactivateAccountCollumn1635880723253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "deactivedAccount" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "deactivedAccount"`);
    }

}
