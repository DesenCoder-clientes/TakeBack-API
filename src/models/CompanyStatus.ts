import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Companies } from "./Company";

@Entity()
export class CompanyStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column()
  blocked: boolean;

  @OneToMany(() => Companies, (companies) => companies.status)
  company: Companies[];
}
