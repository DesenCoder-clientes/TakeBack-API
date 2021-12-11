import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompanyPaymentMethods } from "./CompanyPaymentMethod";

@Entity()
export class PaymentMethods {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @OneToMany(() => CompanyPaymentMethods, () => PaymentMethods)
  companyPaymentMethod: CompanyPaymentMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
