import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompanyPaymentMethods } from "./CompanyPaymentMethod";
import { TransactionPaymentMethods } from "./TransactionPaymentMethod";

@Entity()
export class PaymentMethods {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @OneToMany(() => CompanyPaymentMethods, () => PaymentMethods)
  companyPaymentMethod: CompanyPaymentMethods;

  @OneToMany(() => TransactionPaymentMethods, () => PaymentMethods)
  transactionPaymentMethod: TransactionPaymentMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
