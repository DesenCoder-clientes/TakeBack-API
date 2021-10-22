import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { ConsumerAddress } from './ConsumerAddress'
import { Transactions } from './Transaction'

@Entity()
export class Consumer {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    fullName: string

    @Column()
    birthDate: Date

    @Column({
        nullable: true
    })
    phone: string

    @Column()
    email: string

    @Column()
    cpf: string

    @Column()
    password: string

    @Column({
        nullable: true
    })
    signature: string

    @Column({
        default: 0
    })
    balance: number

    @Column({
        default: 0
    })
    blockedBalance: number

    @Column({
        default: false
    })
    emailConfirmated: boolean

    @Column({
        default: false
    })
    phoneConfirmated: boolean

    @OneToOne(() => ConsumerAddress)
    @JoinColumn()
    address: ConsumerAddress

    @ManyToOne(() => Transactions, () => Consumer)
    transactions: Transactions[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}