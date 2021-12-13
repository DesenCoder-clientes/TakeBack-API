import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterPropertyOnTableTransactionMethod1639399877154 implements MigrationInterface {
    name = 'AlterPropertyOnTableTransactionMethod1639399877154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."transaction_payment_methods" ADD CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0" PRIMARY KEY ("id")`);
    }

}
