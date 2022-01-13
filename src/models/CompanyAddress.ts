import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { City } from "./City";

@Entity()
export class CompaniesAddress {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: true,
  })
  street: string;

  @Column({
    nullable: true,
  })
  district: string;

  @Column({
    nullable: true,
  })
  number: number;

  @Column({
    nullable: true,
  })
  complement: string;

  @ManyToOne(() => City, city => city.companiesAdress)
  city: City;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
