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
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @OneToMany(() => CompanyPaymentMethods, companyPaymentMethods => companyPaymentMethods.paymentMethod)
  public companyPaymentMethod!: CompanyPaymentMethods[];

  @OneToMany(() => TransactionPaymentMethods, transactionPaymentMethods => transactionPaymentMethods.paymentMethod)
  public transactionPaymentMethod!: TransactionPaymentMethods[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
