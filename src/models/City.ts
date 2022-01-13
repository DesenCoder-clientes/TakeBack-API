import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompaniesAddress } from "./CompanyAddress";
import { ConsumerAddress } from "./ConsumerAddress";
import { State } from "./State";

@Entity()
export class City {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  zipCode: string;

  @ManyToOne(() => State, state => state.cities)
  state: State;

  @OneToMany(()=> CompaniesAddress, companiesAddress => companiesAddress.city)
  companiesAdress: CompaniesAddress[];

  @OneToMany(()=> ConsumerAddress, consumerAddress => consumerAddress.city)
  consumersAddress: ConsumerAddress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
