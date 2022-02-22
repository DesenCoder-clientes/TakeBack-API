import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollumnInTableCompanyStatus1645542838104 implements MigrationInterface {
    name = 'AddCollumnInTableCompanyStatus1645542838104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_status" ADD "generateCashback" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_status" DROP COLUMN "generateCashback"`);
    }

}
