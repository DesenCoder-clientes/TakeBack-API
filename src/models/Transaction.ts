import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TransactionTypes } from "./TransactionType";
import { TransactionStatus } from "./TransactionStatus";
import { Consumers } from "./Consumer";
import { Companies } from "./Company";
import { CompanyUsers } from "./CompanyUsers";
import { TransactionPaymentMethods } from "./TransactionPaymentMethod";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "float",
  })
  value: number;

  @Column({
    nullable: true,
    type: "float",
  })
  salesFee: number;

  @Column({
    nullable: true,
    type: "float",
  })
  cashbackPercent: number;

  @Column({
    nullable: true,
    type: "float",
  })
  cashbackAmount: number;

  @Column({
    nullable: true,
  })
  keyTransaction: number;

  @Column({
    nullable: true,
    length: 180,
  })
  cancellationDescription: string;

  @ManyToOne(
    () => TransactionTypes,
    (transactionTypes) => transactionTypes.transaction
  )
  transactionTypes: TransactionTypes;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transaction
  )
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Consumers, (consumers) => consumers.transaction)
  consumers: Consumers;

  @ManyToOne(() => Companies, (companies) => companies.transaction)
  companies: Companies;

  @ManyToOne(() => CompanyUsers, (companyUsers) => companyUsers.transaction)
  companyUsers: CompanyUsers;

  @OneToMany(
    () => TransactionPaymentMethods,
    (transactionPaymentMethods) => transactionPaymentMethods.transactions
  )
  public transactionPaymentMethod!: TransactionPaymentMethods[];

  @Column({
    type: "date",
    nullable: true,
  })
  dateAt: Date;

  @Column({
    type: "date",
    nullable: true,
  })
  aprovedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
