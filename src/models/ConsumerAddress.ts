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
export class ConsumerAddress {
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
  number: string;

  @Column({
    nullable: true,
  })
  complement: string;

  @ManyToOne(() => City, city => city.consumersAddress)
  city: City;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
