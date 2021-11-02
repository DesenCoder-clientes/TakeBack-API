import {MigrationInterface, QueryRunner} from "typeorm";

export class VerifySignatureIsRegister1635862738727 implements MigrationInterface {
    name = 'VerifySignatureIsRegister1635862738727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "signatureRegistered" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "signatureRegistered"`);
    }

}
