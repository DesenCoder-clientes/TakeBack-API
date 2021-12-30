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
  id: number;

  @Column()
  transactionId: string;

  @Column()
  paymentMethodId: number;

  @Column({
    default: 0,
    type: "float",
  })
  cashbackPercentage: number;

  @Column({
    default: 0,
    type: "float",
  })
  cashbackValue: number;

  @ManyToOne(() => Transactions, () => TransactionPaymentMethods)
  transaction: Transactions;

  @ManyToOne(() => CompanyPaymentMethods, () => TransactionPaymentMethods)
  paymentMethod: CompanyPaymentMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
