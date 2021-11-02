import {MigrationInterface, QueryRunner} from "typeorm";

export class CollumnCodeConfirmation1635853260501 implements MigrationInterface {
    name = 'CollumnCodeConfirmation1635853260501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" ADD "codeToConfirmEmail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."consumers" DROP COLUMN "codeToConfirmEmail"`);
    }

}
