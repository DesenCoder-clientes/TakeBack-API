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
import { CompanyUsers } from "./CompanyUsers";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @ManyToOne(() => TransactionTypes, () => Transactions)
  transactionType: TransactionTypes;

  @ManyToOne(() => TransactionStatus, () => Transactions)
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Consumers, () => Transactions)
  consumer: Consumers;

  @ManyToOne(() => Companies, () => Transactions)
  company: Companies;

  @ManyToOne(() => CompanyUsers, () => Transactions)
  companyUser: CompanyUsers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
