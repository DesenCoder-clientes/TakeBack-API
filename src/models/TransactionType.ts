import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Transactions } from "./Transaction";

@Entity()
export class TransactionTypes {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  isUp: boolean;

  @OneToMany(
    () => Transactions,
    (transactions) => transactions.transactionTypes
  )
  transaction: Transactions[];
}
