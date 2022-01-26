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
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @Column()
  public companyId!: string;

  @Column()
  public paymentMethodId!: number;

  @Column({
    default: 0,
    type: "float",
  })
  public cashbackPercentage!: number;

  @Column({
    default: false,
  })
  public isActive!: boolean;

  @ManyToOne(() => Companies, companies => companies.companyPaymentMethod)
  public company!: Companies;

  @ManyToOne(() => PaymentMethods, paymentMethods => paymentMethods.companyPaymentMethod)
  public paymentMethod!: PaymentMethods;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
