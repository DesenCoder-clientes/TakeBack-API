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
    nullable: true,
  })
  socialContract: string;

  @Column({
    nullable: true,
  })
  acceptanceTerm: string;

  @Column({
    default: 0,
    type: "float",
  })
  customIndustryFee: number;

  @Column({
    default: false,
  })
  customIndustryFeeActive: boolean;

  @Column({
    default: 0,
    type: "float",
  })
  positiveBalance: number;

  @Column({
    default: 0,
    type: "float",
  })
  negativeBalance: number;

  @Column({
    default: 0,
    type: "float",
  })
  monthlyPayment: number;

  @OneToOne(() => CompaniesAddress)
  @JoinColumn()
  address: CompaniesAddress;

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.company)
  paymentOrder: PaymentOrder[];

  @OneToMany(() => Transactions, (transactions) => transactions.companies)
  transaction: Transactions[];

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
