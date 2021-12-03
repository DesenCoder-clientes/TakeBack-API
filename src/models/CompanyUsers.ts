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
    select: false,
  })
  password: string;

  @ManyToOne(() => Companies, () => CompanyUsers)
  company: Companies;

  @OneToMany(() => CompanyUserTypes, () => CompanyUsers)
  userType: CompanyUserTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
