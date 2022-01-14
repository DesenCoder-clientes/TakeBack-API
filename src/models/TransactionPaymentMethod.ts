import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompanyPaymentMethods } from "./CompanyPaymentMethod";
import { Transactions } from "./Transaction";

@Entity()
export class TransactionPaymentMethods {
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @Column({
    default: 0,
    type: "float",
  })
  public cashbackPercentage!: number;

  @Column({
    default: 0,
    type: "float",
  })
  public cashbackValue!: number;

  @ManyToOne(
    () => Transactions,
    (transactions) => transactions.transactionPaymentMethod
  )
  public transactions!: Transactions;

  @ManyToOne(
    () => CompanyPaymentMethods,
    (companyPaymentMethods) => companyPaymentMethods.paymentMethod
  )
  public paymentMethod!: CompanyPaymentMethods;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
