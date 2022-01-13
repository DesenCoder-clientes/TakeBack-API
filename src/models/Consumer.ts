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
    default: 0,
    type: "float",
  })
  balance: number;

  @Column({
    default: 0,
    type: "float",
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

  @OneToMany(() => Transactions, transactions => transactions.consumers)
  transaction: Transactions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
