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

  @ManyToOne(() => Companies, (companies) => companies.users)
  company: Companies;

  @ManyToOne(
    () => CompanyUserTypes,
    (companyUserTypes) => companyUserTypes.users
  )
  companyUserTypes: CompanyUserTypes;

  @OneToMany(() => Transactions, (transactions) => transactions.companyUsers)
  transaction: Transactions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
