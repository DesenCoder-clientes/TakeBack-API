import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollumn1646307886673 implements MigrationInterface {
    name = 'AddCollumn1646307886673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment_order" ADD "approvedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment_order" DROP COLUMN "approvedAt"`);
    }

}
