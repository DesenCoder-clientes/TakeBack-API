import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeRelationToUserTypes1638880414809 implements MigrationInterface {
    name = 'ChangeRelationToUserTypes1638880414809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" DROP CONSTRAINT "FK_29d062913e1d031874a16d85c84"`);
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" DROP COLUMN "usersId"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD "userTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" ADD CONSTRAINT "FK_a8b2bb7c3f24e43aa4cb7b782b4" FOREIGN KEY ("userTypeId") REFERENCES "company_user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP CONSTRAINT "FK_a8b2bb7c3f24e43aa4cb7b782b4"`);
        await queryRunner.query(`ALTER TABLE "public"."company_users" DROP COLUMN "userTypeId"`);
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" ADD "usersId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."company_user_types" ADD CONSTRAINT "FK_29d062913e1d031874a16d85c84" FOREIGN KEY ("usersId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
