import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../config/TransformerDecimal";

import { ConsumerAddress } from "./ConsumerAddress";
import { Transactions } from "./Transaction";

@Entity()
export class Consumers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullName: string;

  @Column()
  birthDate: Date;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  signature: string;

  @Column({
    default: false,
  })
  signatureRegistered: boolean;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  blockedBalance: number;

  @Column({
    default: false,
  })
  emailConfirmated: boolean;

  @Column({
    default: false,
  })
  phoneConfirmated: boolean;

  @Column({
    nullable: true,
  })
  codeToConfirmEmail: string;

  @Column({
    default: false,
  })
  deactivedAccount: boolean;

  @OneToOne(() => ConsumerAddress)
  @JoinColumn()
  address: ConsumerAddress;

  @OneToMany(() => Transactions, (transactions) => transactions.consumers)
  transaction: Transactions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
