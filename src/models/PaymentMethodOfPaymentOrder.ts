import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentOrder } from "./PaymentOrder";

@Entity()
export class PaymentMethodOfPaymentOrder {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.paymentMethod)
  paymentOrder: PaymentOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
