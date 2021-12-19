import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompanyUsers } from "./CompanyUsers";

@Entity()
export class CompanyUserTypes {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
    default: false,
  })
  isManager: boolean;

  @OneToMany(() => CompanyUsers, () => CompanyUserTypes)
  users: CompanyUsers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
