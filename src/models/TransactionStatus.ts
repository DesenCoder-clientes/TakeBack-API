import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Transactions } from "./Transaction";

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  blocked: boolean;

  @OneToMany(() => Transactions, () => TransactionStatus)
  transactions: Transactions;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
