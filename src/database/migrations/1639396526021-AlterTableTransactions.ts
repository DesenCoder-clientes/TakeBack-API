import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableTransactions1639396526021 implements MigrationInterface {
    name = 'AlterTableTransactions1639396526021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_payment_methods" ("id" SERIAL NOT NULL, "transactionId" uuid NOT NULL, "paymentMethodId" integer NOT NULL, "cashbackPercentage" double precision NOT NULL DEFAULT '0', "cashbackValue" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" ADD CONSTRAINT "FK_645ff37871e8c12622d49b1bbc1" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" ADD CONSTRAINT "FK_74a9dfc67b14713e3fb750a1dbb" FOREIGN KEY ("paymentMethodId") REFERENCES "company_payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" DROP CONSTRAINT "FK_74a9dfc67b14713e3fb750a1dbb"`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" DROP CONSTRAINT "FK_645ff37871e8c12622d49b1bbc1"`);
        await queryRunner.query(`DROP TABLE "transaction_payment_methods"`);
    }

}
