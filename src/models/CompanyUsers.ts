import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Companies } from "./Company";
import { CompanyUserTypes } from "./CompanyUserTypes";
import { Transactions } from "./Transaction";

@Entity()
export class CompanyUsers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    default: false,
  })
  isRootUser: boolean;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Companies, () => CompanyUsers)
  company: Companies;

  @ManyToOne(() => CompanyUserTypes, () => CompanyUsers)
  userType: CompanyUserTypes;

  @OneToMany(() => Transactions, () => CompanyUsers)
  transactions: Transactions;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
