import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { TransactionTypes } from './TransactionType'
import { TransactionStatus } from './TransactionStatus'
import { Consumers } from './Consumer'
import { Companies } from './Company'

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    value: number

    @Column()
    salesFee: number

    @Column({
        nullable: true
    })
    cashbackAmount: number

    @ManyToOne(() => TransactionTypes, () => Transactions)
    transactionType: TransactionTypes

    @ManyToOne(() => TransactionStatus, () => Transactions)
    transactionStatus: TransactionStatus

    @OneToMany(() => Consumers, () => Transactions)
    consumer: Consumers

    @OneToMany(() => Companies, () => Transactions)
    company: Companies

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}