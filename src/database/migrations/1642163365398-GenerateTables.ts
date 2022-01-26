import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateTables1642163365398 implements MigrationInterface {
    name = 'GenerateTables1642163365398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies_address" ("id" SERIAL NOT NULL, "street" character varying, "district" character varying, "number" integer, "complement" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cityId" integer, CONSTRAINT "PK_ad150e1e829fc0c9013267f3e4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consumer_address" ("id" SERIAL NOT NULL, "street" character varying, "district" character varying, "number" character varying, "complement" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cityId" integer, CONSTRAINT "PK_c0e86059b3acb674fa2496704d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "initials" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "zipCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stateId" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "industries" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "categoryFee" double precision NOT NULL, "iconCategory" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1626dcb2d58142d7dfcca7b8d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_types" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "isUp" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2a49fe7879bf8a02812639cea61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "blocked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consumers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "phone" character varying, "email" character varying NOT NULL, "cpf" character varying NOT NULL, "password" character varying NOT NULL, "signature" character varying, "signatureRegistered" boolean NOT NULL DEFAULT false, "balance" double precision NOT NULL DEFAULT '0', "blockedBalance" double precision NOT NULL DEFAULT '0', "emailConfirmated" boolean NOT NULL DEFAULT false, "phoneConfirmated" boolean NOT NULL DEFAULT false, "codeToConfirmEmail" character varying, "deactivedAccount" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addressId" integer, CONSTRAINT "REL_3ffc911cff52ac729e01188ea1" UNIQUE ("addressId"), CONSTRAINT "PK_9355367764efa60a8c2c27856d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_user_types" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "isManager" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a41da118d3354bf30d1a2fa5c57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isRootUser" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, "companyUserTypesId" integer, CONSTRAINT "PK_fcd31773e604355d8a473de888c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_payment_methods" ("id" SERIAL NOT NULL, "companyId" uuid NOT NULL, "paymentMethodId" integer NOT NULL, "cashbackPercentage" double precision NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f9233e77d51ef422b9c7430f6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_payment_methods" ("id" SERIAL NOT NULL, "cashbackPercentage" double precision NOT NULL DEFAULT '0', "cashbackValue" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionsId" integer, "paymentMethodId" integer, CONSTRAINT "PK_3d6d4cfd25b7a2628411bd0ebf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "value" double precision NOT NULL, "salesFee" double precision, "cashbackPercent" double precision, "cashbackAmount" double precision, "keyTransaction" integer, "cancellationDescription" character varying(180), "dateAt" date, "aprovedAt" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionTypesId" integer, "transactionStatusId" integer, "consumersId" uuid, "companiesId" uuid, "companyUsersId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_status" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "blocked" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0004a562592abd6cb0828df61eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "corporateName" character varying NOT NULL, "fantasyName" character varying NOT NULL, "registeredNumber" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "socialContract" character varying, "acceptanceTerm" character varying, "cashbackPercentDefault" double precision NOT NULL DEFAULT '0', "balance" double precision NOT NULL DEFAULT '0', "blockedBalance" double precision NOT NULL DEFAULT '0', "monthlyPayment" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addressId" integer, "industryId" integer, "statusId" integer, CONSTRAINT "REL_2bb6583d4cf35554e19694c8a9" UNIQUE ("addressId"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "take_back_user_types" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "isRoot" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0d6de4433e9fdb82f55d7d9a68a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "take_back_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userTypeId" integer, CONSTRAINT "PK_764061e99182bd434106e00c341" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "companies_address" ADD CONSTRAINT "FK_f5e207e2b37aaeff6d68a11fe1d" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consumer_address" ADD CONSTRAINT "FK_8a5879957ffa4ceab700ee332a3" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consumers" ADD CONSTRAINT "FK_3ffc911cff52ac729e01188ea1c" FOREIGN KEY ("addressId") REFERENCES "consumer_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_users" ADD CONSTRAINT "FK_f48efdd06dd9b999ae40c3c96a6" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_users" ADD CONSTRAINT "FK_f1c651dcc59347cb084e1ab4163" FOREIGN KEY ("companyUserTypesId") REFERENCES "company_user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" ADD CONSTRAINT "FK_d167c7a5fa7e321ac698cbbc67d" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" ADD CONSTRAINT "FK_50140b197f6a47698d463b4b3aa" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" ADD CONSTRAINT "FK_03ae65f4f819fed4d1837622348" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" ADD CONSTRAINT "FK_74a9dfc67b14713e3fb750a1dbb" FOREIGN KEY ("paymentMethodId") REFERENCES "company_payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_3066de4661577e8b0dd6addfa61" FOREIGN KEY ("transactionTypesId") REFERENCES "transaction_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7d6803adce40f000540e7d5fdb9" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_41a5467545419633ec789204e91" FOREIGN KEY ("consumersId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6353b5ceb4106452422b5dc0d33" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_349047f9afb490b3e4f5f0ee761" FOREIGN KEY ("companyUsersId") REFERENCES "company_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_2bb6583d4cf35554e19694c8a9b" FOREIGN KEY ("addressId") REFERENCES "companies_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_d10b3310c1016d05c123fdd08e1" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_78f70c4376dbfc35f8ba9257295" FOREIGN KEY ("statusId") REFERENCES "company_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "take_back_users" ADD CONSTRAINT "FK_a5f51751e237d232f4e9f44ffda" FOREIGN KEY ("userTypeId") REFERENCES "take_back_user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "take_back_users" DROP CONSTRAINT "FK_a5f51751e237d232f4e9f44ffda"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_78f70c4376dbfc35f8ba9257295"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_d10b3310c1016d05c123fdd08e1"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_2bb6583d4cf35554e19694c8a9b"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_349047f9afb490b3e4f5f0ee761"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6353b5ceb4106452422b5dc0d33"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_41a5467545419633ec789204e91"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7d6803adce40f000540e7d5fdb9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_3066de4661577e8b0dd6addfa61"`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" DROP CONSTRAINT "FK_74a9dfc67b14713e3fb750a1dbb"`);
        await queryRunner.query(`ALTER TABLE "transaction_payment_methods" DROP CONSTRAINT "FK_03ae65f4f819fed4d1837622348"`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" DROP CONSTRAINT "FK_50140b197f6a47698d463b4b3aa"`);
        await queryRunner.query(`ALTER TABLE "company_payment_methods" DROP CONSTRAINT "FK_d167c7a5fa7e321ac698cbbc67d"`);
        await queryRunner.query(`ALTER TABLE "company_users" DROP CONSTRAINT "FK_f1c651dcc59347cb084e1ab4163"`);
        await queryRunner.query(`ALTER TABLE "company_users" DROP CONSTRAINT "FK_f48efdd06dd9b999ae40c3c96a6"`);
        await queryRunner.query(`ALTER TABLE "consumers" DROP CONSTRAINT "FK_3ffc911cff52ac729e01188ea1c"`);
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_e99de556ee56afe72154f3ed04a"`);
        await queryRunner.query(`ALTER TABLE "consumer_address" DROP CONSTRAINT "FK_8a5879957ffa4ceab700ee332a3"`);
        await queryRunner.query(`ALTER TABLE "companies_address" DROP CONSTRAINT "FK_f5e207e2b37aaeff6d68a11fe1d"`);
        await queryRunner.query(`DROP TABLE "take_back_users"`);
        await queryRunner.query(`DROP TABLE "take_back_user_types"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "company_status"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transaction_payment_methods"`);
        await queryRunner.query(`DROP TABLE "company_payment_methods"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TABLE "company_users"`);
        await queryRunner.query(`DROP TABLE "company_user_types"`);
        await queryRunner.query(`DROP TABLE "consumers"`);
        await queryRunner.query(`DROP TABLE "transaction_status"`);
        await queryRunner.query(`DROP TABLE "transaction_types"`);
        await queryRunner.query(`DROP TABLE "industries"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "consumer_address"`);
        await queryRunner.query(`DROP TABLE "companies_address"`);
    }

}
