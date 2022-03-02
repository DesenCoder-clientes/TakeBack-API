import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Companies } from "./Company";
import { PaymentMethodOfPaymentOrder } from "./PaymentMethodOfPaymentOrder";
import { PaymentOrderStatus } from "./PaymentOrderStatus";
import { Transactions } from "./Transaction";

@Entity()
export class PaymentOrder {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    default: 0,
    type: "float",
  })
  value: number;

  @Column({
    nullable: true,
  })
  ticketName: string;

  @Column({
    nullable: true,
  })
  ticketPath: string;

  @Column({
    nullable: true,
  })
  pixKey: string;

  @ManyToOne(
    () => PaymentOrderStatus,
    (paymentStatus) => paymentStatus.paymentOrder
  )
  status: PaymentOrderStatus;

  @ManyToOne(() => Companies, (companies) => companies.paymentOrder)
  company: Companies;

  @OneToMany(() => Transactions, (transaction) => transaction.paymentOrder)
  transactions: Transactions[];

  @ManyToOne(
    () => PaymentMethodOfPaymentOrder,
    (paymentMethod) => paymentMethod.paymentOrder
  )
  paymentMethod: PaymentMethodOfPaymentOrder;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
