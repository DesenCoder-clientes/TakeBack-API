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
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  transactionNumber: number;

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

  @OneToMany(() => TransactionPaymentMethods, () => Transactions)
  transactionPaymentMethod: TransactionPaymentMethods;

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
