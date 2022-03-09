import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../config/TransformerDecimal";

import { Companies } from "./Company";
import { PaymentPlans } from "./PaymentPlans";

@Entity()
export class CompanyMonthlyPayment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  amountPaid: number;

  @ManyToOne(() => Companies, (companies) => companies.companyMonthlyPayment)
  company: Companies;

  @ManyToOne(() => PaymentPlans, (plans) => plans.companyMonthlyPayment)
  plan: PaymentPlans;

  @Column({
    type: "date",
    nullable: true,
  })
  paidDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
