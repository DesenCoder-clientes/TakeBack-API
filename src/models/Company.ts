import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CompaniesAddress } from "./CompanyAddress";
import { Industries } from "./Industry";
import { Transactions } from "./Transaction";
import { CompanyUsers } from "./CompanyUsers";
import { CompanyStatus } from "./CompanyStatus";
import { CompanyPaymentMethods } from "./CompanyPaymentMethod";
import { PaymentPlans } from "./PaymentPlans";
import { PaymentOrder } from "./PaymentOrder";

import { ColumnNumericTransformer } from "../config/TransformerDecimal";
import { CompanyMonthlyPayment } from "./CompanyMonthlyPayment";

@Entity()
export class Companies {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  corporateName: string;

  @Column()
  fantasyName: string;

  @Column()
  registeredNumber: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  customIndustryFee: number;

  @Column({
    default: false,
  })
  customIndustryFeeActive: boolean;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  positiveBalance: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  negativeBalance: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  monthlyPayment: number;

  @Column({
    default: false,
  })
  customMonthlyPayment: boolean;

  @Column({
    default: false,
  })
  currentMonthlyPaymentPaid: boolean;

  @Column({
    type: "date",
    nullable: true,
  })
  firstAccessAllowedAt: Date;

  @Column({
    type: "date",
    nullable: true,
  })
  provisionalAccessAllowedAt: Date;

  @OneToOne(() => CompaniesAddress)
  @JoinColumn()
  address: CompaniesAddress;

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.company)
  paymentOrder: PaymentOrder[];

  @OneToMany(() => Transactions, (transactions) => transactions.companies)
  transaction: Transactions[];

  @OneToMany(
    () => CompanyMonthlyPayment,
    (monthlyPayment) => monthlyPayment.company
  )
  companyMonthlyPayment: CompanyMonthlyPayment[];

  @ManyToOne(() => Industries, (industry) => industry.companies)
  industry: Industries;

  @OneToMany(() => CompanyUsers, (companyUser) => companyUser.company)
  companies: CompanyUsers[];

  @ManyToOne(() => CompanyStatus, (status) => status.company)
  status: CompanyStatus;

  @ManyToOne(() => PaymentPlans, (payment) => payment.company)
  paymentPlan: PaymentPlans;

  @OneToMany(
    () => CompanyPaymentMethods,
    (companyPaymentMethods) => companyPaymentMethods.company
  )
  public companyPaymentMethod!: CompanyPaymentMethods[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
