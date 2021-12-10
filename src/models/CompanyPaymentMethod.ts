import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Companies } from "./Company";
import { PaymentMethods } from "./PaymentMethod";

@Entity()
export class CompanyPaymentMethods {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  companyId: string;

  @Column()
  paymentMethodId: number;

  @Column({
    default: 0,
    type: "float",
  })
  cashbackPercentage: number;

  @ManyToOne(() => Companies, () => CompanyPaymentMethods)
  company: Companies;

  @ManyToOne(() => PaymentMethods, () => CompanyPaymentMethods)
  paymentMethod: PaymentMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
