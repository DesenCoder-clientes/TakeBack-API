import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TransactionTypes } from "./TransactionType";
import { TransactionStatus } from "./TransactionStatus";
import { Consumers } from "./Consumer";
import { Companies } from "./Company";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: number;

  @Column()
  salesFee: number;

  @Column({
    nullable: true,
  })
  cashbackAmount: number;

  @ManyToOne(() => TransactionTypes, () => Transactions)
  transactionType: TransactionTypes;

  @ManyToOne(() => TransactionStatus, () => Transactions)
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Consumers, () => Transactions)
  consumer: Consumers;

  @ManyToOne(() => Companies, () => Transactions)
  company: Companies;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
