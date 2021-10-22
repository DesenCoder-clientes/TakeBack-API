import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { Transactions } from './Transaction'

@Entity()
export class TransactionTypes {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    description: string

    @Column({
        default: false
    })
    isUp: boolean

    @OneToMany(() => Transactions, () => TransactionTypes)
    transactions: Transactions

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}