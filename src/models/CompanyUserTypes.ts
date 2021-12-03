import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompanyUsers } from "./CompanyUsers";

@Entity()
export class CompanyUserTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  description: string;

  @ManyToOne(() => CompanyUsers, () => CompanyUserTypes)
  users: CompanyUsers[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
