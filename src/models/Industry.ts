import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Companies } from "./Company";

@Entity()
export class Industries {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    type: "float",
  })
  categoryFee: number;

  @Column({
    default: 1,
  })
  iconCategory: number;

  @OneToMany(()=> Companies, company => company.industry)
  companies: Companies[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
