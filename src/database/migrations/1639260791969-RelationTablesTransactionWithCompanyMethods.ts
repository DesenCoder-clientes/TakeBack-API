import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationTablesTransactionWithCompanyMethods1639260791969 implements MigrationInterface {
    name = 'RelationTablesTransactionWithCompanyMethods1639260791969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions_payment_methods_company_payment_methods" ("transactionsId" uuid NOT NULL, "companyPaymentMethodsId" integer NOT NULL, CONSTRAINT "PK_02f8c8b7464f9cead91a386f6c4" PRIMARY KEY ("transactionsId", "companyPaymentMethodsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8707adba03aeb8e805ee58c52b" ON "transactions_payment_methods_company_payment_methods" ("transactionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b3903ce19a7eb5d33fe98f046" ON "transactions_payment_methods_company_payment_methods" ("companyPaymentMethodsId") `);
        await queryRunner.query(`ALTER TABLE "transactions_payment_methods_company_payment_methods" ADD CONSTRAINT "FK_8707adba03aeb8e805ee58c52b4" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transactions_payment_methods_company_payment_methods" ADD CONSTRAINT "FK_7b3903ce19a7eb5d33fe98f0466" FOREIGN KEY ("companyPaymentMethodsId") REFERENCES "company_payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions_payment_methods_company_payment_methods" DROP CONSTRAINT "FK_7b3903ce19a7eb5d33fe98f0466"`);
        await queryRunner.query(`ALTER TABLE "transactions_payment_methods_company_payment_methods" DROP CONSTRAINT "FK_8707adba03aeb8e805ee58c52b4"`);
        await queryRunner.query(`DROP INDEX "IDX_7b3903ce19a7eb5d33fe98f046"`);
        await queryRunner.query(`DROP INDEX "IDX_8707adba03aeb8e805ee58c52b"`);
        await queryRunner.query(`DROP TABLE "transactions_payment_methods_company_payment_methods"`);
    }

}
