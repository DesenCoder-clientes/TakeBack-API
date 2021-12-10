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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToMany(() => CompanyPaymentMethods, () => PaymentMethods)
  companyPaymentMethod: CompanyPaymentMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
