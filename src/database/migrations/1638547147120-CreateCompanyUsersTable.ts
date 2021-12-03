import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCompanyUsersTable1638547147120 implements MigrationInterface {
    name = 'CreateCompanyUsersTable1638547147120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "PK_fcd31773e604355d8a473de888c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_users" ADD CONSTRAINT "FK_f48efdd06dd9b999ae40c3c96a6" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_users" DROP CONSTRAINT "FK_f48efdd06dd9b999ae40c3c96a6"`);
        await queryRunner.query(`DROP TABLE "company_users"`);
    }

}
