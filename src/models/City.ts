import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => State, (state) => state.cities)
  state: State;

  @OneToMany(
    () => CompaniesAddress,
    (companiesAddress) => companiesAddress.city
  )
  companiesAdress: CompaniesAddress[];

  @OneToMany(() => ConsumerAddress, (consumerAddress) => consumerAddress.city)
  consumersAddress: ConsumerAddress[];
}
